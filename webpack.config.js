// webpack.config.js
const webpack = require('webpack')
const path = require('path')
var VersionFile = require('webpack-version-file-plugin');

var libPath = path.join(__dirname, 'src');
var wwwPath = path.join(__dirname, 'public');
var pkg = require('./package.json');
var webpackVersion = require('./node_modules/webpack/package.json').version;

const config = {
  context: path.resolve(__dirname, 'src'),
  entry: './renderer.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  devServer: {
     host: '0.0.0.0',     // allow more than localhost
     port: 8080,
     contentBase: './public/',

     // allow NodeJS to run side-by-side with webpack-dev-server
     proxy: {  '/api/*': 'http://localhost:8081/' }   // <- backend
  },

  module: {
    rules: [
      {
      test: /\.js$/,
      include: path.resolve(__dirname, 'src'),
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [ 'react', 'latest', 'stage-2' ]
          }
        }]
      },

      {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
      },

      {
           test: /\.(jpe?g|png|gif|svg)$/i,
           use: [
               'url-loader?limit=24600',
               'img-loader'
           ]
       },

      // JSON is not enabled by default in Webpack but both Node and Browserify
      // allow it implicitly so we also enable it.
      {
         test: /\.json$/,
         use: 'json-loader'
      }
    ]    // end-of rules
  },
  plugins: [
    new VersionFile({
        packageFile:path.join(__dirname, 'package.json'),
        template: path.join(__dirname, 'version.ejs'),
        outputFile: path.join(wwwPath, 'version.js'),
        extras: { webpack: require("./node_modules/webpack/package.json").version }
    })
  ]

}

module.exports = config
