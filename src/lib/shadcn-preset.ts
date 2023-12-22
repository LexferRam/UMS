import { shadcnPlugin } from "./shadcd-plugin";
const withMT = require('next-transpile-modules')(["@material-tailwind/react"]); 

export const shadcnPreset = withMT({
    darkMode: ["class"],
    content: [],
    plugins: [
        shadcnPlugin,
        require('tailwindcss-animate'),
        require('tailwind-scrollbar-hide'),
        require('@tailwindcss/container-queries'),
        require('@tailwindcss/forms')
    ]
})