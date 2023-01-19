/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {},
        fontFamily: {
            sans: ["Poppins", "sans-serif"],
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
    plugins: [],
};
