import { NextFunction, Request, Response } from "express";
import queryPromise from "../Helpers/QueryPromise.helper.js";

export default async function verifysubject(req: Request, res: Response, next: NextFunction) {
    const availableSubjects = await (async function () {
        const subjects = JSON.parse(JSON.stringify(await queryPromise("SELECT id_subject, name FROM subject"))) as {
            [key: string]: string;
        }[];

        const subjectsOrganized = await Promise.all(
            subjects.map(async (e, i) => {
                const areas = JSON.parse(
                    JSON.stringify(await queryPromise(`SELECT name FROM area where id_subject = ${e.id_subject}`))
                ) as {
                    [key: string]: string;
                }[];

                const areasString = areas.map((e) => e.name);

                const areasOrganized = areasString.map((e, i) => {
                    return {
                        id: i + 1,
                        name: e,
                        short: e
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .substring(0, 3)
                            .toLowerCase(),
                    };
                });

                return {
                    id: i + 1,
                    name: e.name,
                    short: String(e.name)
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .substring(0, 3)
                        .toLowerCase(),
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
