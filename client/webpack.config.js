const path = require('path');
const fs = require("fs");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: path.resolve(__dirname, './src/index.js'),
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js']
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js',
    },
    // devServer: {
    //     https: {
    //         key: fs.readFileSync("ssl/privkey.pem"),
    //         cert: fs.readFileSync("ssl/fullchain.pem")
    //     },
    //     static: path.resolve(__dirname, './dist'),
    //     open: true,
    // },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "./static" },
            ],
        }),
    ],
};
