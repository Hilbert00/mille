import { NextFunction, Request, Response } from "express";
import queryPromise from "../Helpers/QueryPromise.helper.js";

export default async function verifysubject(req: Request, res: Response, next: NextFunction) {
    function getName(title: String) {
        title = String(title)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

        if (title.split(" ")[0].substring(0, 3) !== "cie") return title.split(" ")[0].substring(0, 3);

        const newTitle = title
            .split(" ")
            .find((e) => e !== "ciencias" && e.length > 2)
            ?.substring(0, 3);

        return newTitle;
    }

    const availableSubjects = await (async function () {
        const subjects = JSON.parse(JSON.stringify(await queryPromise("SELECT id_subject, name FROM subject"))) as {
            [key: string]: string;
        }[];

        const subjectsOrganized = await Promise.all(
            subjects.map(async (e, i) => {
                const areas = JSON.parse(
                    JSON.stringify(
                        await queryPromise(`SELECT id_area, name FROM area where id_subject = ${e.id_subject}`)
                    )
                ) as {
                    [key: string]: string;
                }[];

                const areasOrganized = areas.map((e, i) => {
                    return {
                        id: e.id_area,
                        name: e.name,
                        short:
                            e.name === "Eletroquímica"
                                ? "elq"
                                : e.name
                                      .toLowerCase()
                                      .normalize("NFD")
                                      .replace(/[\u0300-\u036f]/g, "")
                                      .substring(0, 3),
                    };
                });

                return {
                    id: i + 1,
                    name: e.name,
                    short: getName(e.name),
                    areas: areasOrganized,
                };
            })
        );

        return subjectsOrganized;
    })();

    try {
        const subjectParam = req.body.subject ?? req.params.subject;
        const areaParam = req.body.area;

        const subjectObject = availableSubjects.find((e) => e.short === subjectParam);
        const subject = subjectObject.short;
        if (areaParam) {
            const areaObject = availableSubjects[availableSubjects.indexOf(subjectObject)].areas.find(
                (x) => x.short === areaParam
            );
            const area = areaObject.short;

            if (subject === subjectParam) {
                if (area === areaParam) {
                    req.body.area = areaObject.id;

                    next();
                    return;
                } else {
                    return res.sendStatus(404);
                }
            } else {
                return res.sendStatus(404);
            }
        }
        if (subject === subjectParam) {
            req.params.subject = String(subjectObject.id);
            next();
            return;
        } else {
            return res.sendStatus(404);
        }
    } catch (err) {
        res.sendStatus(404);
    }
}
