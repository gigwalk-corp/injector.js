var path = require('path');

module.exports = {
    module: {
        loaders: [{
            test: /(\.jsx?)$/,
            exclude: /(bower_components|node_modules)/,
            loader: 'babel',
            query: {
                cacheDirectory: true
            }
        }]
    }
};
