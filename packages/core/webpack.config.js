var path = require('path');
const webpack = require('webpack')
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'core.min.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [{
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }]
  }
}