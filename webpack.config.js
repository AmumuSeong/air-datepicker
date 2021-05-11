const webpack = require('webpack');
const path = require('path');
const dev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const NAME = 'air-datepicker';

//  Plugins
// -------------------------------------------------

let plugins = [
    new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV).toLowerCase()
        }
    }),
    new HtmlWebpackPlugin({
        template: './index.html'
    }),
    new webpack.HotModuleReplacementPlugin()
];

let buildPlugins = [
    new MiniCssExtractPlugin({
        filename: `${NAME}.css`,
    }),
]

//  Entry
// -------------------------------------------------

let entry = {
    index: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true', './index.js'],
};

if (!dev) {
    entry.index = './src/datepicker.js';
}

//  Config
// -------------------------------------------------
let config = {
    mode: dev ? 'development' : 'production',
    entry: entry,
    devtool: dev ? 'eval-source-map' : 'none',
    watch: dev,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: dev ? 'js/[name].js' : `${NAME}.js`,
        publicPath: '/',
        chunkFilename: 'js/[name].js',
        library: 'AirDatepicker',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: ['babel-loader']
            },
            {
                test: /\.scss$/,
                use: [
                    dev ? 'style-loader' : MiniCssExtractPlugin.loader,
                    {loader: 'css-loader', options: {sourceMap: dev}},
                    {loader:'postcss-loader', options: {sourceMap: dev}},
                    {loader: 'sass-loader', options: {sourceMap: dev}},
                ]
            },
        ]
    },
    resolve: {
        modules: [`${__dirname}/src/js`, `${__dirname}/src`, 'node_modules']
    },
    plugins: dev ? plugins : buildPlugins,
};

if (dev) {
    config.devServer = {
        contentBase: './dist',
        hot: true
    };
}

module.exports = config;
