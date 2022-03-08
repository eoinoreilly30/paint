const path = require('path');
const fs = require("fs");

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
    devServer: {
        https: {
            key: fs.readFileSync("../devSSL/localhost.key"),
            cert: fs.readFileSync("../devSSL/localhost.crt")
        },
        static: path.resolve(__dirname, './dist'),
        open: true
    }
};
