import type { Config } from "tailwindcss"

const config = {
  darkMode: "class",
  content: [
    './src/pages/**/*.{ts,tsx,mdx}',
    './src/components/**/*.{ts,tsx,mdx}',
    './src/app/**/*.{ts,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        accent: 'var(--accent)',
        border: 'var(--border)',
        surface: 'var(--surface)',
        success: 'var(--success)',
        error: 'var(--error)',
      },
    },
  },
  plugins: [],
} satisfies Config

export default config