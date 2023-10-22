import swal from "sweetalert2";

export default async function unlockTitle(titles: number | number[]) {
    const titlesUpdated = typeof titles === "number" ? [titles] : titles;

    fetch(process.env.NEXT_PUBLIC_API_URL + "/api/titles/unlock", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ title_id: titles }),
    }).then(async (res) => {
        if (!res.ok) return;

        const unlocked = (await res.json()).inserted;

        if (unlocked)
            swal.fire({
                title: "Parabéns!",
                text: "Você desbloqueou novos títulos de usuário!",
                icon: "success",
                background: "#1E1E1E80",
                color: "#fff",
            });
    });
}
