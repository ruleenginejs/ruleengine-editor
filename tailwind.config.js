module.exports = {
  purge: false,
  darkMode: false,
  theme: {
    extend: {
      colors: {
        "editor-background": "var(--editor-background)",
        "editor-foreground": "var(--editor-foreground)",
      },
      spacing: {
        "5sp": "0.3125rem",
        "13sp": "0.8125rem"
      },
      fontSize: {
        "13sp": ['0.8125rem', { lineHeight: '1.1375rem' }],
      }
    }
  },
  variants: {},
  plugins: []
}
