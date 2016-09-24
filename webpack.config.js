const minimize = process.argv.indexOf('--optimize-minimize') > -1;

module.exports = {
    entry: './js/index.js',
    output: {
        path: __dirname,
        filename: `bundle${minimize ? '.min' : ''}.js`
    },
    module: {
        loaders: [
            {test: /\.js$/, loader: 'babel', exclude: /node_modules/},
            {test: /\.css$/, loader: 'style!css!autoprefixer'},
            {test: /\.(png|svg)/, loader: 'url'}
        ]
    }
};