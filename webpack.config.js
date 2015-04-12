// var webpack = require('webpack');
//
// var plugins = [
//   new webpack.optimize.CommonsChunkPlugin('build/common.js'),
//   new webpack.DefinePlugin({
//     'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
//   })
// ];

module.exports = {
  entry: "./app/app.js",
  output: {
    filename: "build/bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [ 'babel-loader' ]
      },
      {
        test: /\.styl$/,
        loader: 'css-loader!stylus-loader?paths=node_modules/bootstrap-stylus/stylus/'
      }
    ]
  },

  // plugins: plugins
};
