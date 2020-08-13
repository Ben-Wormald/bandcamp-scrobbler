const { CleanWebpackPlugin: Clean } = require('clean-webpack-plugin');
const Copy = require('copy-webpack-plugin');

module.exports = {
  output: {
    filename: 'index.js',
  },
  plugins: [
    new Clean(),
    new Copy({
      patterns: [
        { from: 'src/index.html' },
        { from: 'src/manifest.json' },
      ],
    }),
  ],
};