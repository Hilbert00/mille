/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            keyframes: {
                ellipsis: {
                    to: { width: "18px" },
                },
            },
            animation: {
                "loading-ellipsis": "ellipsis steps(4, end) 900ms infinite",
            },
            colors: {
                primary: {
                    white: "#F5F5F5",
                    DEFAULT: "#191919",
                },
                bgBlack: {
                    DEFAULT: "#1E1E1E",
                },
            },
        },
        fontFamily: {
            sans: ["Poppins", "sans-serif"],
        },
    },
    plugins: [require("@tailwindcss/line-clamp")],
};
