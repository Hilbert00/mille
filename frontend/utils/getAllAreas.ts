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

export default async function getAllAreas() {
    const worldsRes = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/world");
    const worldsData = await worldsRes.json();
    const worlds = worldsData.map((e: any) => {
        return { ...e, simple: getName(e.name) };
    });

    const result = {} as any;

    const data = await Promise.all(
        worlds.map(async (e: any) => {
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/world/${e.simple}`);
            const data = await response.json();

            const areas = data
                .map((e: any) => {
                    try {
                        const areas = e.area_name.map((el: any, i: number) => {
                            return { name: el, id: e.area_id[i] };
                        });

                        return areas;
                    } catch {
                        return { name: e.area_name, id: e.area_id };
                    }
                })
                .flat();

            return {
                subject_name: e.name,
                areas,
            };
        })
    );

    data.forEach((e: any) => {
        result[e.subject_name] = e.areas;
    });

    return result;
}
