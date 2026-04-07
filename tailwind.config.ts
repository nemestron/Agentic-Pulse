import type { Config } from "tailwindcss"

const config = {
  darkMode: "class",
  content: [
    './src/**/*.{ts,tsx,mdx}',
    './node_modules/@tremor/**/*.{js,ts,jsx,tsx}',
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
        tremor: {
          brand: {
            faint: 'var(--surface)',
            muted: 'var(--border)',
            subtle: 'var(--accent)',
            DEFAULT: 'var(--accent)',
            emphasis: 'var(--foreground)',
            inverted: 'var(--background)',
          },
          background: {
            muted: 'var(--surface)',
            subtle: 'var(--background)',
            DEFAULT: 'var(--background)',
            emphasis: 'var(--surface)',
          },
          border: {
            DEFAULT: 'var(--border)',
          },
          ring: {
            DEFAULT: 'var(--accent)',
          },
          content: {
            subtle: 'var(--border)',
            DEFAULT: 'var(--foreground)',
            emphasis: 'var(--accent)',
            strong: 'var(--foreground)',
            inverted: 'var(--background)',
          },
        },
        'dark-tremor': {
          brand: {
            faint: 'var(--surface)',
            muted: 'var(--border)',
            subtle: 'var(--accent)',
            DEFAULT: 'var(--accent)',
            emphasis: 'var(--foreground)',
            inverted: 'var(--background)',
          },
          background: {
            muted: 'var(--surface)',
            subtle: 'var(--background)',
            DEFAULT: 'var(--background)',
            emphasis: 'var(--surface)',
          },
          border: {
            DEFAULT: 'var(--border)',
          },
          ring: {
            DEFAULT: 'var(--accent)',
          },
          content: {
            subtle: 'var(--border)',
            DEFAULT: 'var(--foreground)',
            emphasis: 'var(--accent)',
            strong: 'var(--foreground)',
            inverted: 'var(--background)',
          },
        }
      },
    },
  },
  plugins: [],
} satisfies Config

export default config