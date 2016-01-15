const webpack = require('webpack');
const path = require('path');
const moment = require('moment');
const pkg = require('./package');

const banner =
`${pkg.name} - v${pkg.version} - ${ moment().format('YYYY-MM-DD')}
${pkg.homepage}
Copyright (c) ${ moment().format('YYYY') } ${pkg.author.name}`;

module.exports = {
    devtool: 'source-map',
    entry: {
        'injector-js': './src/index',
        'injector-to-context': './src/injectIntoContext.js'
    },
    output: {
        path: path.join(__dirname, './lib/standalone'),
        filename: '[name].js',
        library: '[name]',
        libraryTarget: 'umd'
    },
    externals: [
        function ignoreNodeModules(context, request, cb) {
            if (/(^[a-z\-0-9]+$|babel)/.test(request)) {
                cb(null, 'commonjs ' + request);
            } else if (request === './index.js') {
                cb(null, 'commonjs @gigwalk/injector-js');
            } else {
                cb();
            }
        }
    ],
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
