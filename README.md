
## [webpack官网](https://www.webpackjs.com/concepts/)
## webpack学习记录
    使用webpack时间也不短了，但是从来都是写业务之类的，项目框架什么的都是老大在搞，所以想抽出来点时间自己学习下.webpack现在是前端工程化中重要的一个技术，如果不用或者不学习就有点跟不上节奏了，希望自己不要‘一🐏迁徙’。

#### webpack可以做哪些事情
    代码转换：将我们的es6代码转换为es5
    文件优化: 压缩代码体积
    代码分割：将js、css、html分开打包
    模块合并：将多个模块合并为一个模块
    自动刷新: 通过webpack-dev-server启动本地服务实现代码刷新、热更新
    代码校验：校验我们的代码是否规范
    自动发布：需要一个插件将我们打包后的代码发布到服务器上

#### 我们应该学习些什么
    webpack常见配置
    webpack高级配置
    webpack优化策略
    ast抽象语法树(webpack如何解析)
    webpack中的Tapable(事件流)
    掌握webpack流程，手写webpack
    可以实现常用的loader
    可以实现常用的plugin

## 一.webpack安装
### 1.1安装本地的webpack
    $ yarn add webpack webpack-cli -D
    # 这里肯定有人会问为什么还要安装webpack-cli）因为webpack-dev-server被放在了webpack-cli

    $ -D === --save-dev
    # 这个表示上线时不需要此以来只是在开发环境中会用到 -S === --save 这个是上线也需要此依赖. 默认是--save

    $ mkdir webpack && cd webpack  -> yarn init -y
    # 创建名为webpack的文件并且切换到此文件 后续在初始化一个package.json包管理文件 -y是直接生成默认的不需要询问里面的每一项。

### 1.2webpack可以进行0配置使用
    打包工具 -> 输出后的结果(js模块)
    # 我们在我们刚才安装webpack成功的目录下新建一个src目录下面新建一个index.js文件

```
# index.js文件内容
$ console.log('学习webpack的内容');

# 打包文件index.js
$ npx webpack

# 为什么？因为我们执行此命令的时候他是先去node_modules中找.bin中的webpack.cmd
# 代码的大概意思就是 首先判断是否有node.exe，如果没有就去node_modules/webpack/webpack.js,这里就需要用到webpack-cli
```

    执行完代码后发现我们的项目目录下面有一个dist目录下面多了一个main.js

### 1.3手动配置webpack
    默认配置文件的名字是webpack.config.js;我们在项目的根目录下新建webpack.config.js的文件
    
    我们也可以不起这个名字 可以使用其他的名字比如node_modules/webpack-cli/config-yargs.js中有说到也可以是webpackfile.js 当然我们也可以起其他的名字之后打包的时候通过参数的形式告诉webpack使用哪个配置文件 

```bash
//  webpack是node写出来的 所以我们也要采用node的写法
let path = require('path'); // 引入路径模块
module.exports = {
    mode: 'production',
    entry: './src/index.js', // 入口文件 webpack是通过这个入口去逐步将所有js文件以及其他文件打包起来 的. 这里使用的是相对路劲
    output: { 
        filename: 'bundle.[hash:8].js', // 打包后的文件名称
        path: path.resolve(__dirname, 'dist'), // 打包后的路径就是文件放在哪里 必须是一个绝对路径 __dirname是指当前目录下
    },
    plugins: [// 放着所有的webpack插件
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            minify: { //配置压缩代码需要是production环境
                removeAttributeQuotes: true, // 删除掉html中的双引号
                collapsWhitespace: true, // 打包出来的html文件显示在一行
            },
            hash: true,// 每个文件名都带hash
        })
    ]
}
```
#### 1.3.1webpack-dev-server来进行启动一个本地服务
    我们需要使用插件来干这件事情，这个内置的webpack-dev-server是通过express来实现的
    安装： yarn add webpack-dev-server -D
    启动： npx webpack-dev-server 我会发现我们启动了一个8080端口的本地服务
    接下来我们访问 http://localhost:8080
    问题是无法定位到我们的html模板 所以我们需要进行配置下
    devServer: { // 开发服务器的配置
        port: 3000, // 运行在3000端口号上
        progress: true, // 显示启动的进度条
        contentBase: './build' // 指定找这个文件下的代码
    }
    之后我们需要去配置一下我们的脚本 因为我们每次启动本地服务的时候需要 npx webpack-dev-server 有点太繁琐了，所以我们就在package.json中的scripts中去配置 dev-server: 'npx webpack-dev-server'这样我们就可以直接使用npm run dev-server 来启动本地的服务

#### 1.3.2使用插件自动创建HTML文件
    let HtmlWebpackPlugin = require('html-webpack-plugin');//引入自动创建生成html模板的插件
    这里我们需要装一下这个插件 yarn add html-webpack-plugin -D
     plugins: [// 放着所有的webpack插件
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html'
        })
    ]

#### 1.3.3样式处理
    需要配置打包我们css或者less或者sass的loader
    安装loader
    npm install style-loader css-loader -D
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
                  loader: 'style-loader',
                  options: {
                      insertAt: 'top' // 我们将我们打包出来的style标签插入到我们在页面自己手写的上方这样就不会有覆盖问题了
                  }
                }, 'css-loader']
            }
        ]
    }
    
    报错了 ' options has an unknown property 'insertAt'' 我们去看源码 node_modules/style-loader/dist/index.js
    
    const insert = typeof options.insert === 'undefined' ? '"head"' : typeof options.insert === 'string' ? JSON.stringify(options.insert) : options.insert.toString();
    const injectType = options.injectType || 'styleTag';
    从源码中我们可以看到没有insertAt和 singleton 只有 insert 和 injectType
    
    所以我们修改配置

     module:{
        rules: [
            { 
                test: /\.css$/, 
                use: [{
                  loader: 'style-loader',// head标签
                  options: {
                    insert: 'top',
                    injectType: 'singletonStyleTag'
                  }
                }, 'css-loader']
            }
        ]
    }

    增加less-loader yarn less less-loader -D
    增加配置
    
    module:{
        rules: [
            {
                test: /\.less$/,
                 use: [{
                  loader: 'style-loader',// head标签
                  options: {
                    insert: 'top',
                    <!-- injectType: 'singletonStyleTag' -->
                  }
                }, 'css-loader', 'less-loader']
            }
        ]
    }
    
    我们继续来搞我们的样式
    抽离css插件  yarn add mini-css-extract-plugin -D  webpacj 4.x
    我们在使用的时侯首先将我们的插件进行new 一下 里面传参的话是打包出来的文件的名称 之后我们需要将我们的 MiniCssExtractPlugin.loader添加在我们的css规则中 如下
    { 
        test: /\.css$/, 
        use: [{
            loader: 'style-loader',// head标签
            options: {
            insert: 'top',
            //insertAt: 'top', // 我们将我们打包出来的style标签插入到我们在页面自己手写的上方这样就不会有覆盖问题了
            // singleton: true, // 将所有style合并为一个
            injectType: 'singletonStyleTag'
            }
        }, MiniCssExtractPlugin.loader, 'css-loader']
    },

    现在我们需要将我们的css样式添加一个浏览器兼容性的前缀用来兼容不同浏览器的差别
    首先我们来安装插件 yarn add postcss-loader autoprefixer -D
    使用方法和其他loader一样 在解析css-2loader之前进行添加 
    
    此外我们还需要在项目的根目录下新建一个postcss.config.js
    module.exports = {
        plugins: [require('autoprefixer')]
    }
    这里build会报一个错误我们需要进行安装postcss

    接下来我们发现我们的css并没有被压缩还是之前的样子所以我们需要对我们的css进行压缩
    yarn add optimize-css-assets-webpack-plugin -D
    之后需要在文件中像其他插件一样的引用

    将es6转换为es5
    首先需要安装babel-loader  @label/core @babel/preset-env -D
    之后在webpack中配置 rule规则

    并且我们需要安装一下es6的运行环境 transform-runtime
    我们来安装这个插件 npm install --save @babel/runtime

    npm install --save-dev @babel/plugin-transform-runtime

    配置完 include 和exclude后会报 resolve是not defined 所以我们需要搞一个辅助函数
    function resolve(dir) {
        return path.join(__dirname, dir);
    }

    安装填充模块
    npm install @babel-polifill -D