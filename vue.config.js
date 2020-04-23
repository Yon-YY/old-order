const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir)
}

// 导入compression-webpack-plugin
const CompressionWebpackPlugin = require('compression-webpack-plugin');
// 定义压缩文件类型
const productionGzipExtensions = ['js', 'css', 'styl'];

module.exports = {
  chainWebpack: config => {
    config.optimization.minimize(true);
    config.optimization.splitChunks({
      chunks: 'all'
    });
    // //压缩图片
    config.module
      .rule('images')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({
        bypassOnDebug: true
      }).end()
  },
  css: {
    loaderOptions: {
      stylus: {
        import: '~@/common/stylus/variable.styl'
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        assets: "@/assets",
        stylus: "@/common/stylus",
        js: "@/common/js",
        api: "@/common/api",
        components: "@/components",
        pages: "@/pages"
      }
    },
    //统一配置打包插件
    plugins: [
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),//匹配文件名
        threshold: 10240,//对10K以上的数据进行压缩
        minRatio: 0.8,
        deleteOriginalAssets: false,//是否删除源文件
      })
    ]
  }
}
