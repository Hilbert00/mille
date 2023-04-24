export default async function getQuizData(quiz: number) {
    const url = `http://localhost:8080/api/quiz/get/${quiz}`;

    const response = await fetch(url, { credentials: "include" });

    if (!response.ok) throw `${response.status}: ${response.statusText}`;

    const data = await response.json();

    return data;
}
