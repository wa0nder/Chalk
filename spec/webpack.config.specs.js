const path = require('path');

module.exports = {
  entry: './spec/AccountHome.spec.js',
  
  output: {
    filename: 'spec.js',
    path: path.resolve(__dirname, ''),
    //publicPath: '/spec/'
  }
};