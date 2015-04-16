var webpack = require('webpack');

// var plugins = [
//   new webpack.optimize.CommonsChunkPlugin('build/common.js'),
//   new webpack.DefinePlugin({
//     'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
//   })
// ];

module.exports = {
  devtool: 'eval',

  entry: './app/scripts/app.js',
  output: {
    path: __dirname + '/dist/scripts/',
    filename: 'app.js'
  },
  cache : true,
  stats : {
    colors : true,
    reasons: true
  },
  module: {
    loaders: [{
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [ 'babel-loader' ]
      },
      {
        test  : /\.styl$/,            // require('**.styl')の設定
        loader: 'style!css!stylus'
    }],
    resolve: {
       extensions: ['', '.js', '.styl']
     },
    externals: {
      // Reactをnpmからでなくグローバルから取得する
      'react': 'React'
    },
  }
};
