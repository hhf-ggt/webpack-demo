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
    ],
    module:{ // 模块
        rules: [
            // 规则 css-loader 接受@import 这种语法的
            // style-loader 是将css插入到head标签中的
            // loader的特点就是希望单一
            // 多个loader 需要使用数组 一个loader使用字符串loader
            // loader是有顺序的 从右到左 从下到上
            // loader还可以写为一个对象 这样方便传递参数
            { 
                test: /\.css$/, 
                use: [{
                  loader: 'style-loader',// head标签
                  options: {
                    insert: 'top',
                    // insertAt: 'top', // 我们将我们打包出来的style标签插入到我们在页面自己手写的上方这样就不会有覆盖问题了
                    // singleton: true, // 将所有style合并为一个
                    injectType: 'singletonStyleTag'
                  }
                }, 'css-loader']
            },
            {
                test: /\.less$/,
                 use: [{
                  loader: 'style-loader',// head标签
                  options: {
                    insert: 'top'
                  }
                }, 'css-loader', 'less-loader']
            }
        ]
    }
}