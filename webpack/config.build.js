var path = require('path');
var webpack = require('webpack');
var node_modules = path.resolve(__dirname, '../node_modules');
module.exports = {
    entry: {
        bundle: './app/index.jsx',
        vendor: ['react', 'react-dom', 'react-router', 'lodash']
    },
    output: {
        path: path.resolve(__dirname, '../build'),
        publicPath: 'build/',
        filename: '[name].js',
        chunkFilename: 'chunk.[id].js',
        pathinfo: true,
        library: '[name]_library'
    },
    module: {
        loaders: [
            {
                test: /\.js(x)*?$/,
                loaders: ['babel'],
                exclude: [/node_modules/]
            }, {
                test: /\.css/,
                loaders: ['style', 'css']
            }
        ]
    },
    resolve: {
        root: path.resolve('app'),
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js', '.jsx', '.css']
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            minimize: true,
            sourceMap: false
        }),
        new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js", Infinity)
    ],
    devtool: 'false'
};
