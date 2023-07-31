import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as duelHandler from "./Routes/duel/Duel.game.js";
import { Server } from "socket.io";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const app = express.default();

app.use(bodyParser.default.json());
app.use(bodyParser.default.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
    cors({
        origin: [process.env.FRONTEND_URL, "http://127.0.0.1:5500"],
        credentials: true,
        preflightContinue: true,
    })
);

// ROUTES
import signUp from "./Routes/auth/SignUp.route.js";
import auth from "./Routes/auth/Auth.route.js";
import changePass from "./Routes/auth/ChangePass.route.js";
import exit from "./Routes/auth/Exit.route.js";
import emailVerification from "./Routes/auth/EmailVerification.route.js";

import user from "./Routes/User.route.js";
import quiz from "./Routes/Quiz.route.js";
import world from "./Routes/solo/World.route.js";

import posts from "./Routes/social/Posts.route.js";
import answer from "./Routes/social/Answer.route.js";

import addQuestions from "./Routes/AddQuestions.route.js";

app.use("/api/auth/signup", signUp);
app.use("/api/auth/login", auth);
app.use("/api/auth/changepass", changePass);
app.use("/api/auth/exit", exit);
app.use("/api/auth/verify", emailVerification);

app.use("/api/user", user);
app.use("/api/quiz", quiz);
app.use("/api/world", world);

app.use("/api/social", posts);
app.use("/api/social/post", answer);

app.use("/api/questions", addQuestions);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

server.listen(PORT, () => console.log(`Rodando na porta: ${PORT}`));

// DUEL WEBSOCKETS

const state: {
    [key: string]: {
        players: {
            name: string;
            level: number;
            title: string;
            timer: number;
            points: number;
            questions: {}[];
        }[];
        subject: string;
        timer: number;
        questionQuantity: number;
        questions: {}[];
        active: boolean;
    };
} = {};
const clientData: { id: string; room: string; playerNumber: 1 | 2 }[] = [];

io.on("connection", (socket) => {
    socket.on("createRoom", (user) => {
        const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        let result = "";
        for (let i = 0; i < 8; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        clientData.push({ id: socket.id, room: result, playerNumber: 1 });

        state[result] = duelHandler.initDuel();

        state[result].players[0].name = user.username;
        state[result].players[0].level = user.user_level;
        state[result].players[0].title = "titulo";

        socket.join(result);

        socket.emit("createdRoom", result, JSON.stringify(state[result]));
    });

    socket.on("joinRoom", async (room, user) => {
        const usersInRoom = (await io.in(room).fetchSockets()).length;

        if (!usersInRoom) {
            socket.emit("unknowGame");
        } else if (usersInRoom > 1) {
            socket.emit("fullGame");
        } else {
            clientData.push({ id: socket.id, room: room, playerNumber: 2 });

            state[room].players[1].name = user.username;
            state[room].players[1].level = user.user_level;
            state[room].players[1].title = "titulo";

            socket.join(room);
            io.to(room).emit("joinedRoom", JSON.stringify(state[room]));
        }
    });

    socket.on("gameStart", (roomState, room) => {
        state[room] = { ...JSON.parse(roomState), active: true };
        io.to(room).emit("gameInit", JSON.stringify(state[room]));
    });

    socket.on("disconnect", () => {
        const index = clientData.findIndex((e) => e.id === socket.id);

        if (index !== -1) {
            const room = clientData[index].room;
            const playerNumber = clientData[index].playerNumber;

            if (state[room].players[1].name) {
                if (playerNumber === 1) {
                    state[room].players[0] = { ...state[room].players[1] };

                    const remainingPlayer = clientData.find((e) => e.room === room && e.id !== socket.id);
                    if (remainingPlayer) remainingPlayer.playerNumber = 1;
                }
                state[room].players[1] = duelHandler.emptyPlayerSlot();
            } else {
                delete state[room];
            }

            clientData.splice(index, 1);
            io.to(room).emit("exitedRoom", JSON.stringify(state[room]));
        }
    });

    socket.on("nextQuestion", (answer, points) => {
        const index = clientData.findIndex((e) => e.id === socket.id);

        if (index !== -1) {
            const room = clientData[index].room;
            const playerNumber = clientData[index].playerNumber;

            state[room].players[playerNumber - 1].questions.push(answer);
            state[room].players[playerNumber - 1].points += points;

            if (
                state[room].players[0].questions.length === state[room].questionQuantity &&
                state[room].players[1].questions.length === state[room].questionQuantity
            )
                state[room].active = false;

            io.to(room).emit("duelUpdate", JSON.stringify(state[room]));
        }
    });
});
