module.exports = {
  content: ['./src/**/*.vue'],
  theme: {
    extend: {
      colors: {
        foreground: 'var(--v-foreground)',
        'editor-background': 'var(--v-editor-background)',
        'editor-foreground': 'var(--v-editor-foreground)'
      },
      spacing: {
        '5sp': '0.3125rem',
        '13sp': '0.8125rem'
      },
      fontSize: {
        '13sp': ['0.8125rem', { lineHeight: '1.1375rem' }],
        '14sp': ['0.875rem', { lineHeight: '1.1875rem' }],
        '16sp': '1rem'
      }
    }
  },
  variants: {},
  plugins: []
};
