const { DefinePlugin: Define } = require('webpack');
const { CleanWebpackPlugin: Clean } = require('clean-webpack-plugin');
const Copy = require('copy-webpack-plugin');

const MODE_PRODUCTION = 'production';

const transformManifest = (content, { mode }) => {
  const manifest = JSON.parse(content.toString());

  manifest.name = mode === MODE_PRODUCTION
    ? 'Bandcamp Scrobbler'
    : 'Bandcamp Scrobbler [dev]';
  manifest.browser_specific_settings.gecko.id = mode === MODE_PRODUCTION
    ? 'bandcamp-scrobbler@benwormald.co.uk'
    : 'bandcamp-scrobbler-dev@benwormald.co.uk';

  return JSON.stringify(manifest, null, 2);
};

module.exports = (_env, argv) => ({
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
        {
          from: './src/manifest.json',
          transform: (content) => transformManifest(content, argv),
        },
        { from: './src/resource/', to: 'resource/' },
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
});
