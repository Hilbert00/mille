export function initDuel() {
    const state = createState();
    return state;
}

export function createState() {
    return {
        players: [emptyPlayerSlot(), emptyPlayerSlot()],
        subject: "",
        timer: 0,
        questionQuantity: 0,
        questions: [],
        active: false,
    };
}

export function emptyPlayerSlot() {
    return {
        name: "",
        level: 0,
        title: "título",
        timer: 0,
        points: 0,
        questions: [],
    };
}
