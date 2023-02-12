export default async function getDoneCount(array: number[] | string[]) {
    async function getData(quiz: number[] | string[]) {
        const url = `http://localhost:8080/api/quiz/${quiz}?typeArray=${array}`;
        const response = await fetch(url, { credentials: "include" });

        if (!response.ok) throw `${response.status}: ${response.statusText}`;

        const data = await response.json();

        return data;
    }

    const data = await getData(array);

    const count = data.map((e: any) => {
        if (e.done) {
            return e.questions.filter((f: any) => f.alternatives.answered === f.alternatives.correct).length;
        }

        return 0;
    });

    try {
        return count.reduce((acc: any, cur: any) => acc + cur);
    } catch {
        return 0;
    }
}
