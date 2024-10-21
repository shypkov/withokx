const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig(
  {
  publicPath: '/withokx/',
  transpileDependencies: ['quasar'],
  pluginOptions: { 
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    }
  }
}
)
