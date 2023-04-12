import webpack from 'webpack';
import Copy from 'copy-webpack-plugin';

const MODE_PRODUCTION = 'production';
const FIREFOX = 'firefox';

const transformManifest = (content, { mode }) => {
  const browser = process.env.BROWSER;

  const manifest = JSON.parse(content.toString());

  if (browser === FIREFOX) {
    manifest.background = {
      scripts: [
        manifest.background.service_worker,
      ],
    };

    manifest.browser_specific_settings = {
      gecko: {
        id: mode === MODE_PRODUCTION
          ? 'bandcamp-scrobbler@benwormald.co.uk'
          : 'bandcamp-scrobbler-dev@benwormald.co.uk',
      },
    };
  }

  manifest.name = mode === MODE_PRODUCTION
    ? 'Bandcamp Scrobbler'
    : 'Bandcamp Scrobbler [dev]';

  return JSON.stringify(manifest, null, 2);
};

export default (_env, argv) => ({
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
    new webpack.DefinePlugin({
      'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
      'process.env.SECRET_KEY': JSON.stringify(process.env.SECRET_KEY || ''),
    }),
  ],
  output: {
    clean: true,
  },
  resolve: {
    fallback: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
    },
  },
  devtool: false,
  performance: { hints: false },
});
