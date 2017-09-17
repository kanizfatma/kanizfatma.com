const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ENV = process.env.NODE_ENV;

const webpackConfig = {
  entry : '~/entry.js',
  resolve: {
    alias:{
      '~': path.resolve(__dirname, 'src')
    }
  },
  output: {
    path: path.resolve(__dirname, 'public/build'),
    publicPath: `${process.env.PUBLIC_PATH || ''}/build/`,
    chunkFilename: '[name]-[chunkhash].chunk.js',
    filename: '[name]-bundle.js',
    sourceMapFilename: '[file].map'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: [/node_modules/],
      use: 'babel-loader'
    }, {
      test: /\.(png|jpg|jpeg|gif|woff|woff2|eot|ttf|svg)$/,
      use: 'file-loader'
    }]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': `"${ENV}"`
    }),
    new HtmlWebpackPlugin({
      template : 'ejs-loader!./src/index.ejs',
      filename : ENV == 'production' ? '../index.html': 'index.html',
      env      : process.env
    })
  ],
  devtool: (ENV === 'development') ? 'source-map' : false
};

if(ENV == 'development') {
  webpackConfig.output.publicPath = '/';
  webpackConfig.module.rules.push(...[{
    test: /\.(scss|css)$/,
    exclude: /node_modules/,
    use: ['style-loader', 'css-loader?sourceMap', 'postcss-loader?sourceMap', 'sass-loader?sourceMap'],
  }]);
  webpackConfig.devServer = {
    host: '0.0.0.0',
    port: 9393,
    //https: true,
    inline: true,
    hot: true,
    contentBase: 'public',
    historyApiFallback: true,
    stats: {
      chunks: false
    }
  };
}

if(ENV == 'production') {
  webpackConfig.module.rules.push(...[{
    test: /\.(scss|css)$/,
    exclude: /node_modules/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: ['css-loader', 'postcss-loader', 'sass-loader']
    })
  }]);
  webpackConfig.plugins.push(...[
    new ExtractTextPlugin('[name]-[hash].bundle.css')
  ]);
}

module.exports = webpackConfig;
