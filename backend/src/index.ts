import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import http from "http";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as duelHandler from "./Routes/duel/Duel.game.js";
import { Server } from "socket.io";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const app = express.default();

app.use(bodyParser.default.json());
app.use(bodyParser.default.urlencoded({ extended: true }));

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
        preflightContinue: true,
    })
);

// ROUTES
import signUp from "./Routes/auth/SignUp.route.js";
import auth from "./Routes/auth/Auth.route.js";
import changePass from "./Routes/auth/ChangePass.route.js";
import emailVerification from "./Routes/auth/EmailVerification.route.js";

import user from "./Routes/User.route.js";
import picture from "./Routes/pictureHandler/Picture.route.js";
import titles from "./Routes/Titles.route.js";
import quiz from "./Routes/Quiz.route.js";
import world from "./Routes/solo/World.route.js";

import posts from "./Routes/social/Posts.route.js";
import answers from "./Routes/social/Answer.route.js";
import reports from "./Routes/social/Reports.route.js";
import requests from "./Routes/social/Requests.route.js";
import roles from "./Routes/social/Roles.route.js";

import addQuestions from "./Routes/AddQuestions.route.js";

app.use("/api/auth/signup", signUp);
app.use("/api/auth/login", auth);
app.use("/api/auth/changepass", changePass);
app.use("/api/auth/verify", emailVerification);

app.use("/api/user", user);
app.use("/api/picture", picture);
app.use("/api/titles", titles);
app.use("/api/quiz", quiz);
app.use("/api/world", world);

app.use("/api/social", posts);
app.use("/api/social", reports);
app.use("/api/social", requests);
app.use("/api/social", roles);
app.use("/api/social/post", answers);

app.use("/api/questions", addQuestions);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.FRONTEND_URL } });

server.listen(PORT, () => console.log(`Rodando na porta: ${PORT}`));

// DUEL WEBSOCKETS

const state: {
    [key: string]: {
        players: {
            name: string;
            level: number;
            title: string;
            picture: string;
            points: number;
            questions: {}[];
        }[];
        subject: string;
        area: string;
        timer: number;
        questionQuantity: number;
        questions: {}[];
        status: 0 | 1 | 2;
        private: boolean;
    };
} = {};
let clientData: { id: string; userId: number; room: string; playerNumber: 1 | 2 }[] = [];

io.on("connection", (socket) => {
    socket.on("createRoom", (user) => {
        const canCreate = clientData.findIndex((e) => e.userId === user.id) === -1;

        if (!canCreate) return socket.emit("alreadyInGame");

        const characters = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ123456789";

        let result = "";
        for (let i = 0; i < 8; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        clientData.push({ id: socket.id, userId: user.id, room: result, playerNumber: 1 });

        state[result] = duelHandler.initDuel();

        state[result].players[0].name = user.username;
        // state[result].players[0].level = user.user_level;
        state[result].players[0].title = user.title;
        state[result].players[0].picture = user.picture;

        socket.join(result);

        socket.emit("createdRoom", result, JSON.stringify(state[result]));
    });

    socket.on("joinRoom", async (user, room) => {
        const canJoin = clientData.findIndex((e) => e.userId === user.id) === -1;

        if (!canJoin) return socket.emit("alreadyInGame");

        if (!room) {
            room = Object.keys(state).find((key) => !state[key].players[1].name && !state[key].private);

            if (!room) return socket.emit("noGamesFound");
        }

        const usersInRoom = (await io.in(room).fetchSockets()).length;

        if (!usersInRoom) {
            socket.emit("unknowGame");
        } else if (usersInRoom > 1) {
            socket.emit("fullGame");
        } else {
            clientData.push({ id: socket.id, userId: user.id, room: room, playerNumber: 2 });

            state[room].players[1].name = user.username;
            // state[room].players[1].level = user.user_level;
            state[room].players[1].title = user.title;
            state[room].players[1].picture = user.picture;

            socket.join(room);
            io.to(room).emit("joinedRoom", JSON.stringify(state[room]));
        }
    });

    socket.on("updatePrivacy", (isPrivate, room) => {
        state[room] = { ...state[room], private: isPrivate };
        io.to(room).emit("privacyUpdated", JSON.stringify(state[room]));
    });

    socket.on("gameStart", (roomState, room) => {
        state[room] = { ...JSON.parse(roomState), status: 1 };
        io.to(room).emit("gameInit", JSON.stringify(state[room]));
    });

    socket.on("disconnect", () => {
        const index = clientData.findIndex((e) => e.id === socket.id);

        if (index !== -1) {
            const room = clientData[index].room;

            delete state[room];
            clientData = clientData.filter((e) => e.room !== room);

            io.to(room).emit("exitedRoom");
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
                state[room].status = 2;

            io.to(room).emit("duelUpdate", JSON.stringify(state[room]));
        }
    });
});
