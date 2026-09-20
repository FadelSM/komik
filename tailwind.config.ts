import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          DEFAULT: '#F59E0B',
        },
        crimson: {
          DEFAULT: '#FF4655',
          dark: '#E02636',
          glow: 'rgba(255, 70, 85, 0.4)',
        },
        dark: {
          void: '#07080B',
          bg: '#0B0D13',
          surface: '#11151F',
          card: '#161C2A',
          'card-hover': '#1E2538',
          border: '#242D42',
          'border-light': '#323E59',
          muted: '#8B9BB4',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 25px -5px rgba(245, 158, 11, 0.35)',
        'glow-crimson': '0 0 25px -5px rgba(255, 70, 85, 0.35)',
        'comic': '4px 4px 0px 0px rgba(0,0,0,0.8)',
        'comic-gold': '4px 4px 0px 0px rgba(245, 158, 11, 0.9)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'halftone': "radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};

export default config;
