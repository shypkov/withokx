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
      '/api': {
        target: 'https://api.bitget.com', // Change to your API base URL
        changeOrigin: true,
        pathRewrite: { '^/api': '' }, // Remove /api prefix when sending requests
      },
    },
  },
});