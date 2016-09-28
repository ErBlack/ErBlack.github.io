const ExtractTextPlugin = require('extract-text-webpack-plugin');
const minimize = process.argv.indexOf('--optimize-minimize') > -1;

module.exports = {
    entry: './js/index.js',
    output: {
        path: __dirname,
        filename: `bundle${minimize ? '.min' : ''}.js`
    },
    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader', 'autoprefixer-loader')
            },
            { test: /\.png/, loader: 'url' },
            { test: /\.svg/, loader: 'url!svgo' }
        ]
    },
    
    plugins: [
        new ExtractTextPlugin(`bundle${minimize ? '.min' : ''}.css`)
    ]
};