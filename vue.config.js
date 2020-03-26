module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/EpiSkylines/'
    : '/',
  chainWebpack: config => {
    // HTML Loader
    config.module
      .test(/\.html$/)
      .use("html-loader")
      .loader("html-loader")
      .end()
  }
};
