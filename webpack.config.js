var path = require('path');
var webpack = require('webpack');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');

module.exports = {
  devtool: 'eval',

  entry: './src/scripts/app.js',
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
        test  : /\.styl$/,
        loader: 'style!css!stylus'
    }],
    resolve: {
       extensions: ['', '.js', '.styl']
     }
  }
};
