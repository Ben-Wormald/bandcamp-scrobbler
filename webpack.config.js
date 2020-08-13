const { CleanWebpackPlugin: Clean } = require('clean-webpack-plugin');
const Copy = require('copy-webpack-plugin');

module.exports = {
  entry: {
    popup: './src/popup.js',
    background: './src/background.js',
  },
  plugins: [
    new Clean(),
    new Copy({
      patterns: [
        { from: './src/popup.html' },
        { from: './src/manifest.json' },
      ],
    }),
  ],
};
