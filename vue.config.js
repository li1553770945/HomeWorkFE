module.exports = {
    runtimeCompiler: true,
    publicPath: './',           //  解决打包之后静态文件路径404的问题
    outputDir: 'dist',        //  打包后的文件夹名称，默认dist
    devServer: {
        open: true,             //  npm run serve 自动打开浏览器
        index: '/index.html',    //  默认启动页面
        proxy: {
            '/api': {
                target: 'http://localhost:8000/',  // 接口地址
                changeOrigin: true,
            }
        },
        
    disableHostCheck: true
    }
}
