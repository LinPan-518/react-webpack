const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path  = require('path')
var mode = process.env.NODE_ENV || 'development';
module.exports = {
    mode:'production',
    entry:'./src/index.js',
    devtool: (mode === 'development') ? 'inline-source-map' : false,
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'main.js',
        clean:true
    },
    /**
     * 项目中存在各种各样的样式文件，我们可以通过loader来加载。通常我们需要安装以下loader：
        style-loader 将模块导出的内容作为样式并添加到 DOM 中
        css-loader 加载 CSS 文件并解析 import 的 CSS 文件，最终返回 CSS 代码
        less-loader 加载并编译 LESS 文件
        sass-loader 加载并编译 SASS/SCSS 文件
        postcss-loader 使用 PostCSS 加载并转换 CSS/SSS 文件
        stylus-loader 加载并编译 Stylus 文件
     * 
     */
    module:{
        rules:[
            {
                test:/\.(css|scss)$/,
                use:['style-loader','css-loader','sass-loader']//倒序使用
            },
            {
                //MiniCssExtractPlugin：会将CSS提取到单独的文件中，
                test:/\.(css|scss)$/,
                use:[
                    MiniCssExtractPlugin.loader,'css-loader','sass-loader'
                ]
            },
            /**
             * babel-loader ：webpack中用babel解析ES6的桥梁
               @babel/core：babel的核心模块
               @babel/preset-env：babel预设，一组babel插件的集合
             */
            {
                test:/\.m?js$/,
                exclude:/(node_modules)/,
                use:{
                    loader:'babel-loader',
                    options:{
                        presets: ['@babel/preset-env'],
                        plugins: [
                            '@babel/plugin-transform-runtime'
                            //安装regeneratorRuntime插件，
                            //这是webpack打包生成的全局辅助函数，
                            //由babel生成，用于兼容async/await语法。
                        ]
                    }
                }
            },
            {
                test:/\.(js|jsx)$/,
                exclude:/(node_modules)/,
                use:{
                    loader:'babel-loader',
                    options:{
                        presets: ['@babel/preset-env',
                            '@babel/preset-react'],
                        plugins: [
                            '@babel/plugin-transform-runtime'
                            //安装regeneratorRuntime插件，
                            //这是webpack打包生成的全局辅助函数，
                            //由babel生成，用于兼容async/await语法。
                        ]
                    }
                }
            }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:'./public/index.html',
            filename:'index.html',
            inject:'body'
        }),
        /**
         * MiniCssExtractPlugin：会将CSS提取到单独的文件中，
         * 为每个包含CSS的JS文件（打包后的）创建一个CSS文件，
         * 并且支持CSS和SourceMaps的按需加载
         */
        new MiniCssExtractPlugin({
            filename:'./styles/[contenthash].css'
        })
    ],
    optimization:{
        minimizer:[new CssMinimizerPlugin()]
        //这个插件使用cssnano优化和压缩CSS
    },
    devServer:{
        hot: true,
        static:'./dist'
    }
}