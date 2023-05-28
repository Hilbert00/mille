export default async function getQuizData(quiz: number) {
    const url = process.env.NEXT_PUBLIC_API_URL + `/api/quiz/get/${quiz}?parsed=false`;

    const response = await fetch(url, { credentials: "include" });

    if (!response.ok) throw `${response.status}: ${response.statusText}`;

    const data = await response.json();

    return data;
}
