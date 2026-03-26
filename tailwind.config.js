/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],

  safelist: [
    "bg-blue-200","border-blue-400",
    "bg-green-200","border-green-400",
    "bg-purple-200","border-purple-400",
    "bg-yellow-200","border-yellow-400",
    "bg-pink-200","border-pink-400",
    "bg-indigo-200","border-indigo-400",

    "bg-red-200","border-red-400",
    "bg-orange-200","border-orange-400",
    "bg-teal-200","border-teal-400",
    "bg-cyan-200","border-cyan-400",
    "bg-lime-200","border-lime-400",
    "bg-emerald-200","border-emerald-400",
    "bg-violet-200","border-violet-400",
    "bg-rose-200","border-rose-400",
    "bg-sky-200","border-sky-400",
  ],
  theme: {
    extend: {
      animation: {
        blob: "blob 20s infinite alternate",
        "blob-reverse": "blob-reverse 25s infinite alternate",
        twinkle: "twinkle 3s ease-in-out infinite",
        "float-crystal": "float-crystal 10s ease-in-out infinite",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(50px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-40px, 40px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        "blob-reverse": {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(-50px, 50px) scale(1.2)" },
          "66%": { transform: "translate(40px, -40px) scale(0.8)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.2", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1)" },
        },
        "float-crystal": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-20px) rotate(5deg)" },
        },
      },
    },
  },
  plugins: [],
};