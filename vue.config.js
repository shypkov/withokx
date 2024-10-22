const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig(
  {
  publicPath: process.env.NODE_ENV === 'production' ? '/withokx/' : '/',
  transpileDependencies: ['quasar'],
  pluginOptions: { 
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    }
  }
}
)
