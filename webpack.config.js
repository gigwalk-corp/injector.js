const webpack = require('webpack');
const path = require('path');
const moment = require('moment');
const pkg = require('./package');
const transformUMDExternal = require('webpack-umd-external');
const banner =
`${pkg.name} - v${pkg.version} - ${ moment().format('YYYY-MM-DD')}
${pkg.homepage}
Copyright (c) ${ moment().format('YYYY') } ${pkg.author.name}`;

module.exports = {
    devtool: 'source-map',
    entry: {
        injector: './src/index',
        injectIntoContext: './src/injectIntoComponent'
    },
    output: {
        path: path.join(__dirname, './lib/standalone'),
        filename: '[name].js',
        library: '[name]',
        libraryTarget: 'umd'
    },
    externals: transformUMDExternal({
        './Injector': 'injector.Injector',
        react: 'React'
    }),
    module: {
        loaders: [{
            test: /(\.jsx?)$/,
            exclude: /(bower_components|node_modules)/,
            loader: 'babel',
            query: {
                cacheDirectory: true
            }
        }]
    },
    plugins: [
        new webpack.BannerPlugin(banner)
    ]
};
