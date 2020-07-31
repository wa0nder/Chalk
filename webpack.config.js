const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './js/react_components/AccountHome.js',
  
  output: {
    filename: 'Components.js',
    path: path.resolve(__dirname, 'js'),
    publicPath: '/js/'
  },
  optimization: {
     minimize: false
  }
};