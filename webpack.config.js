var path = require('path')
var webpack = require('webpack')
var manifest = require('./manifest.json')
var node_modules = path.resolve(__dirname, './node_modules')
var config = {
    context: path.resolve(__dirname, './'),
    entry: './app/index.jsx',
    output: {
        path: path.resolve(__dirname, './assets'),
        filename: 'components.min.js',
        publicPath: 'assets/'
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.jsx', '.css', '.less', '.sass']
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader']
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader', 'postcss-loader']
            },
            {
                test: /\.js(x)*?$/,
                use: ['react-hot-loader', 'babel-loader'],
                exclude: [/node_modules/]
            }
        ]
    },
    plugins: [new webpack.DllReferencePlugin({ context: __dirname, manifest: manifest })]
}

if (process.env.NODE_ENV == 'dev') {
    config.plugins.push(new webpack.HotModuleReplacementPlugin())
    config.devtool = 'eval'
    config.devServer = { host: '0.0.0.0', hot: true, port: 9090, inline: true, compress: true }
} else {
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true, sourceMap: false, warnings: false }))
}

module.exports = config
