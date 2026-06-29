import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Disable Tailwind's CSS reset so it doesn't conflict with existing globals.css
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      // Match the project's existing CSS variable palette
      colors: {
        'ai-bg':       { DEFAULT: '#08080E', light: '#F8FAFC' },
        'ai-surface':  { DEFAULT: '#111118', 2: '#18181F', light: '#FFFFFF', '2-light': '#F1F5F9' },
        'ai-accent':   '#00D4FF',
        'ai-muted':    { DEFAULT: '#8888A0', light: '#64748B' },
        'ai-text':     { DEFAULT: '#F0F0F0', light: '#0F172A' },
        'ai-border':   '#ffffff0f',
        'ai-border2':  '#ffffff1f',
        'ai-success':  '#4ade80',
        'ai-error':    '#ff6b6b',
        'ai-warning':  '#fbbf24',
      },
      fontFamily: {
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
        body:    ['Inter',         'system-ui', 'sans-serif'],
      },
      keyframes: {
        typingBounce: {
          '0%, 60%, 100%': { transform: 'translateY(0)',    opacity: '0.4' },
          '30%':            { transform: 'translateY(-5px)', opacity: '1'   },
        },
        slideUp: {
          '0%':   { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',     opacity: '1' },
        },
        drawerIn: {
          '0%':   { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)'    },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.4' },
        },
      },
      animation: {
        typing:   'typingBounce 1.2s ease infinite',
        slideUp:  'slideUp 0.2s ease forwards',
        drawerIn: 'drawerIn 0.3s cubic-bezier(0.32, 0.72, 0, 1) forwards',
        fadeIn:   'fadeIn 0.15s ease forwards',
        pulse:    'pulse 1.5s ease infinite',
      },
      boxShadow: {
        'ai-glow': '0 0 24px rgba(0, 212, 255, 0.25)',
        'ai-btn':  '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
      transitionTimingFunction: {
        'drawer': 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
    },
  },
}

export default config
