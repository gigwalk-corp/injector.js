var path = require('path');

module.exports = {
    module: {
        loaders: [{
            test: /(\.jsx?)$/,
            exclude: /(bower_components|node_modules)/,
            include: [
                path.resolve(__dirname, 'src'),
                path.resolve(__dirname, 'spec')
            ],
            loader: 'babel',
            query: {
                cacheDirectory: true
            }
        }]
    }
};
