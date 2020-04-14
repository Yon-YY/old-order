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
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
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
  },
  // outputDir: 在npm run build时 生成文件的目录 type:string, default:‘dist‘
  outputDir: "oldOrder",
  //   lintOnSave：{ type:Boolean default:true } 是否使用eslint
  lintOnSave: true, // productionSourceMap：{ type:Bollean,default:true } 生产源映射
  // 如果不需要生产时的源映射，那么将此设置为false可以加速生产构建
  productionSourceMap: false, // devServer:{type:Object} 3个属性host,port,https
  devServer:
    {
      port: 8082, // 端口号
      host: "0.0.0.0",
      https: false, // https:{type:Boolean}
      open: false, //配置自动启动浏览器
    }
}
