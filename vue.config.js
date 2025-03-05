const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production' ? '/withokx/' : '/',
  transpileDependencies: ['quasar'],
  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    }
  },
  devServer: {
    proxy: {
      '/api/bitget': {  // Оставляем Bitget
        target: 'https://api.bitget.com',
        changeOrigin: true,
        pathRewrite: { '^/api/bitget': '' },
      },
      '/api/okx': {  // Добавляем OKX
        target: 'https://www.okx.com',
        changeOrigin: true,
        pathRewrite: { '^/api/okx': '' },
        secure: false, // Игнорируем SSL (если есть проблемы)
      }
    }
  }
});