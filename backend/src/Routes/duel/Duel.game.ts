export function initDuel() {
    const state = createState();
    return state;
}

export function createState() {
    return {
        players: [emptyPlayerSlot(), emptyPlayerSlot()],
        subject: "",
        area: "",
        timer: 0,
        questionQuantity: 0,
        questions: [],
        status: 0 as 0 | 1 | 2,
        private: true,
    };
}

export function emptyPlayerSlot() {
    return {
        name: "",
        level: 0,
        title: "",
        picture: null,
        points: 0,
        questions: [],
    };
}
