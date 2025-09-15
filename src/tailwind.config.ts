import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0b1720',
        panel: '#0f172a',
        brand: '#60a5fa',
        muted: '#94a3b8',
      },
    },
  },
  plugins: [],
} satisfies Config
