const webpack = require('webpack');
const baseConfig = require('./webpack.config');
const _ = require('lodash');

const distConfig = _.assign({}, {
    externals: {
        'babel-runtime': 'require("babel-runtime")',
        'babel-polyfill': 'require("babel-polyfill")'
    },

    plugins: baseConfig.plugins.concat([
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: true
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.AggressiveMergingPlugin()
    ])
}, baseConfig);

distConfig.output.filename = '[name].min.js';

module.exports = distConfig;
