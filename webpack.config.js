const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const path = require('path');

function getPolyfillUrl() {
  const features = [
    'Promise',
    'requestAnimationFrame',
    'URL',
  ];
  return `https://polyfill.guim.co.uk/v2/polyfill.min.js?features=${encodeURIComponent(features.join(','))}`
}

function getSupportUrl() {
  const acquisitionData = {
    componentType: 'ACQUISITIONS_EPIC',
    source: 'GUARDIAN_WEB',
    componentId: 'iframe_control_epic_no_js_v2',
    abTest: {
      name: 'iframe_or_not_v2',
      variant: 'iframe'
    }
  };
  return `https://support.theguardian.com/contribute?acquisitionData=${encodeURIComponent(JSON.stringify(acquisitionData))}`
}

function buildTemplateParams() {
  return {
    supportUrl: getSupportUrl(),
    polyfillUrl: getPolyfillUrl()
  }
}

module.exports = {
  mode: 'production',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      inlineSource: '.(js|css)$',
      template: './src/index.template.html',
      minify: true,
      templateParams: buildTemplateParams(),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    }),
    new HtmlWebpackInlineSourcePlugin()
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          // for config, see postcss.config.js and .browserslistrc
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        // for config, see .eslintrc.json
        test: /\.js$/,
        loader: "eslint-loader",
      }
    ]
  }
};
