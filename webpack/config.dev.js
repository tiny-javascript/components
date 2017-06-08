var path = require('path');
var webpack = require('webpack');

var node_modules = path.resolve(__dirname, '../../node_modules');

module.exports = {
    entry: {
        bundle: './app/index.jsx',
        vendor: ['react', 'react-dom', 'react-router', 'lodash']
    },
    output: {
        path: path.resolve(__dirname, 'build'),
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
                loaders: ['react-hot', 'babel'],
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
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('dev')
            }
        }),
        new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js", Infinity)
    ],
    devServer: {
        contentBase: './',
        devtool: 'cheap-eval-source-map',
        hot: true,
        inline: true,
        host: '0.0.0.0',
        port: 9090,
        compress: true
    },
    devtool: 'cheap-eval-source-map'
};
