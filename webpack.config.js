// const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, 'src/client/public');
const APP_DIR = path.resolve(__dirname, 'src/client/app');

const config = {
  entry: {
    support : `${APP_DIR}/index.jsx`,
    // client: `${APP_DIR}/index2.jsx`,
  },
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'

  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: APP_DIR,
        loader: 'babel-loader',
        query: {
          presets:['react', 'es2015', 'stage-2']
        }
      },
      {
          test: /\.css$/,
          loader: 'style-loader!css-loader'
      }
    ]
  }
};

module.exports = config;
