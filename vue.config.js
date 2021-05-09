module.exports = {
  lintOnSave: false,
  chainWebpack: config => {
    if (process.env.BUILD_LIB) {
      config.externals({
        "vue": "vue",
        "@ruleenginejs/ruleengine-ui-kit-vue": "@ruleenginejs/ruleengine-ui-kit-vue",
        "debounce": "debounce",
        "is-plain-object": "is-plain-object",
        "merge": "merge"
      })
    }
  },
  configureWebpack: {
    devtool: process.env.NO_SOURCE_MAP ? false : "source-map",
    plugins: []
  }
}
