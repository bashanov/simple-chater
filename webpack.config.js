const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DotenvWebpackPlugin = require('dotenv-webpack');

const outputDirectory = 'dist';

module.exports = {
    entry: path.join(__dirname, '/src/client/index.jsx'),
    output: {
        filename: 'build.js',
        path: path.join(__dirname, outputDirectory)
    },
    node: {
        fs: "empty"
    },
    externals: ["uws", "net", "ws"],
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }]
    },
    plugins: [
        new CleanWebpackPlugin([outputDirectory]),
        new HtmlWebpackPlugin(
            {
                template: path.join(__dirname, '/src/client/html/index.html'),
                title: "title"
            }
        ),
        new CopyWebpackPlugin([
            {from: 'src/server/', to: '[name].[ext]'},
            '.env',
            'package.json'
        ]),
        new DotenvWebpackPlugin()
    ]
};