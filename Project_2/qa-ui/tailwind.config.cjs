/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        goodblue: '#005eb8',
        lightblue: '#daedff',
        coursecolor: '#d0b1e5',
        coursebg: '#f2f2f2',
      },
    },
  },
  plugins: [],
}
