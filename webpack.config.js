var webpack = require('webpack');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
var PATHS = "./core/images";
module.exports = {
    entry: {
        bundle: ['webpack/hot/dev-server','./app/Route.js', './app/core/js/angular-1.3.0.js', './app/core/js/angular-animate.js', './app/core/js/angular-ui-router.js', './app/core/js/jquery.min.js']
    },
    output: {
        filename: './target/bundle.js'
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'ng-annotate-loader!babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.html$/,
                loader: "raw"
            },
            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=500000&name=./imgs/[name].[ext]'
            }
        ]
    },
    plugins: [
        new uglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new CopyWebpackPlugin([
            {from: './imgs', to: './target/imgs'}
        ]),
        new webpack.HotModuleReplacementPlugin()
    ],
}
;
