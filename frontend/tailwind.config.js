/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── existing (untouched) ──
        primary: {
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        dark: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // ── Phase 0: elevation tokens (DESIGN §1.1) ──
        'surface-base':     '#0A0C10',
        surface:            '#12141B',
        'surface-elevated': '#1A1D26',
        'surface-hover':    '#1F222C',
        overlay:            'rgba(26, 29, 38, 0.72)',
        // ── Phase 0: accent tokens (DESIGN §1.5) ──
        achievement:        '#F5B942',
      },
      borderColor: {
        subtle:  'rgba(255, 255, 255, 0.06)',
        DEFAULT: 'rgba(255, 255, 255, 0.10)',
      },
      fontSize: {
        display:   ['36px', { lineHeight: '1.2',  fontWeight: '700' }],
        heading:   ['20px', { lineHeight: '1.4',  fontWeight: '600' }],
        body:      ['14px', { lineHeight: '1.5',  fontWeight: '400' }],
        secondary: ['13px', { lineHeight: '1.5',  fontWeight: '400' }],
        caption:   ['11px', { lineHeight: '1.4',  fontWeight: '600',
                              letterSpacing: '0.06em',
                              textTransform: 'uppercase' }],
      },
      borderRadius: {
        'radius-sm':   '8px',
        'radius-md':   '12px',
        'radius-lg':   '20px',
        'radius-full': '9999px',
      },
      boxShadow: {
        card:          '0 1px 2px rgba(0,0,0,0.40)',
        floating:      '0 8px 32px rgba(0,0,0,0.45)',
        'glow-accent': '0 0 0 1px rgba(59,130,246,0.40), 0 0 16px rgba(59,130,246,0.20)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}