import type { Config } from 'tailwindcss'

const withMT = require('@material-tailwind/react/utils/withMT')
module.exports = withMT({
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  screens: {
    xs: '320px',
    sm: '450px',
    md: '718px',
    lg: '992px',
  },
  theme: {
    extend: {},
  },
  plugins: [],
})
