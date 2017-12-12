var path = require('path')
var webpack = require('webpack')
module.exports = {
    entry: {
        common: ['babel-polyfill', 'react', 'history', 'react-dom', 'react-router']
    },
    output: {
        path: path.resolve(__dirname, './static'),
        filename: '[name].min.js',
        library: '[name]'
    },
    plugins: [new webpack.optimize.UglifyJsPlugin({ comments: false }), new webpack.DllPlugin({ context: path.resolve(__dirname, './'), path: 'manifest.json', name: '[name]' })]
}
