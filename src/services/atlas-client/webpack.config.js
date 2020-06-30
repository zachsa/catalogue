const Dotenv = require('dotenv-webpack')
const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')
const packageJson = require('./package.json')
// const { GenerateSW } = require('workbox-webpack-plugin')
require('dotenv').config()

const { NODE_ENV: mode } = process.env

module.exports = () => {
  const output = 'dist'
  return {
    mode,
    entry: {
      index: './src/index.jsx',
    },
    output: {
      filename: '[name].js',
      path: path.join(__dirname, output),
      publicPath: '/',
    },
    resolve: {
      alias: {
        // OpenLayers
        'ol/control': path.resolve(__dirname, './node_modules/ol/control'),
        'ol/format': path.resolve(__dirname, './node_modules/ol/format'),
        'ol/layer/Group': path.resolve(__dirname, './node_modules/ol/layer/Group'),
        'ol/View': path.resolve(__dirname, './node_modules/ol/View'),
        'ol/Map': path.resolve(__dirname, './node_modules/ol/Map'),

        // Apollo
        '@apollo/client': path.resolve(__dirname, './node_modules/@apollo/client'),

        // Material UI
        '@material-ui/core': path.resolve(__dirname, './node_modules/@material-ui/core'),
        '@material-ui/icons': path.resolve(__dirname, './node_modules/@material-ui/icons'),

        // React
        react: path.resolve(__dirname, './node_modules/react'),
        'react-dom': path.resolve(__dirname, './node_modules/react-dom'),

        // @saeon
        '@saeon/quick-form': path.resolve(
          __dirname,
          mode === 'production'
            ? './node_modules/@saeon/quick-form'
            : '../../packages/quick-form/src'
        ),
        '@saeon/pkce-client': path.resolve(
          __dirname,
          mode === 'production'
            ? './node_modules/@saeon/pkce-client'
            : '../../packages/pkce-client/src'
        ),
        '@saeon/snap-menus': path.resolve(
          __dirname,
          mode === 'production'
            ? './node_modules/@saeon/snap-menus'
            : '../../packages/snap-menus/src'
        ),
        '@saeon/ol-react': path.resolve(
          __dirname,
          mode === 'production' ? './node_modules/@saeon/ol-react' : '../../packages/ol-react/src'
        ),
        '@saeon/catalogue-search': path.resolve(
          __dirname,
          mode === 'production'
            ? './node_modules/@saeon/catalogue-search/dist/catalogueReact'
            : '../../packages/catalogue-search/src'
        ),
        '@saeon/logger': path.resolve(
          __dirname,
          mode === 'production' ? './node_modules/@saeon/logger/dist' : '../../packages/logger/src'
        ),
      },
      extensions: ['.js', '.jsx'],
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'async',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              rootMode: 'upward',
              envName: mode,
            },
          },
        },
        {
          test: /\.*css$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.(woff|woff2|eot|ttf)$/,
          use: [
            {
              loader: 'file-loader',
            },
          ],
        },
        {
          test: /\.svg$/,
          use: ['@svgr/webpack'],
        },
        {
          test: /\.(png|jpg|gif)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                fallback: 'file-loader',
                name: '[name][md5:hash].[ext]',
                outputPath: 'assets/',
                publicPath: '/assets/',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new Dotenv(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, './public'),
            to: path.resolve(__dirname, './dist'),
          },
        ],
      }),
      // mode === 'production' ? new GenerateSW({}) : null,
      new HtmlWebPackPlugin({
        template: 'index.html',
        filename: path.join(__dirname, output, 'index.html'),
        PUBLIC_PATH: '',
        PACKAGE_DESCRIPTION: packageJson.description,
        PACKAGE_KEYWORDS: packageJson.keywords,
      }),
    ].filter(_ => _),
    devServer: {
      contentBase: path.join(__dirname, output),
      historyApiFallback: true,
      compress: true,
      allowedHosts: ['.localhost'],
      headers: {
        'Access-Control-Allow-Headers': '*',
      },
    },
  }
}
