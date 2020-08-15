const { DefinePlugin: Define } = require('webpack');
const { CleanWebpackPlugin: Clean } = require('clean-webpack-plugin');
const Copy = require('copy-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              'preact',
            ],
          },
        },
      },
    ],
  },
  entry: {
    popup: './src/popup.js',
    background: './src/background.js',
  },
  plugins: [
    new Clean(),
    new Copy({
      patterns: [
        { from: './src/popup.html' },
        { from: './src/popup.css' },
        { from: './src/manifest.json' },
      ],
    }),
    new Define({
      'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
      'process.env.SECRET_KEY': JSON.stringify(process.env.SECRET_KEY || ''),
    }),
  ],
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
  performance: { hints: false },
};
