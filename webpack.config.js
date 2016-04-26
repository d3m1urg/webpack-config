var webpack = require("webpack"),
    path = require("path"),
    ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: [
        "bootstrap-sass!./bootstrap-sass.config.js",
        path.resolve(__dirname, "app/app.js")
    ],
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "build")
    },
    module: {
        loaders: [
            {test: /\.jsx?$/, include: [path.resolve(__dirname, 'app'), /es6-promise/, /xxx/], loader: "es3ify-loader"},
            {test: /\.jsx?$/, include: [path.resolve(__dirname, 'app'), /es6-promise/], loader: "babel-loader"},
            {test: /\.s?css$/, loaders: ['style', 'css', 'sass']},
            {test: /\.(png|gif|jpg|woff|woff2|ttf|eot|svg).*/, loader: 'file'}
        ]
    },
    resolve: {
        root: path.resolve(__dirname, "app"),
        extensions: ["", ".js"],
        alias: {
            react: path.resolve('./node_modules/react'),
            alt: path.resolve('./node_modules/alt')
        }
    },
    plugins: [
        new ExtractTextPlugin("bundle.css")
    ]
};
