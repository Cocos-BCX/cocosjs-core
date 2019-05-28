var path = require('path');
const webpack = require('webpack')
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'core.min.js',
    path: path.resolve(__dirname, 'dist')
  }
}