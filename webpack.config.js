let path = require('path'); // 引入路径模块
let HtmlWebpackPlugin = require('html-webpack-plugin');//引入自动创建生成html模板的插件
module.exports = {
    mode: 'development', // 默认的模式有两种一种是 development还有一种是production两种
    devServer:{ // 开发服务器的配置
        port: 3000, // 运行在3000端口号上
        progress: true, // 显示启动的进度条
        contentBase: './dist', // 指定找这个文件下的代码
        compress: true, // 启动压缩
    },
    entry: './src/index.js', // 入口文件 webpack是通过这个入口去逐步将所有js文件以及其他文件打包起来 的. 这里使用的是相对路劲
    output: { 
        filename: 'bundle.js', // 打包后的文件名称
        path: path.resolve(__dirname, 'dist'), // 打包后的路径就是文件放在哪里 必须是一个绝对路径
    },
    plugins: [// 放着所有的webpack插件
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html'
        })
    ]
}