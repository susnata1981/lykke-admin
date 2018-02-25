const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractSass = new ExtractTextPlugin({
  filename: "[name].[contenthash].css",
  // disable: process.env.NODE_ENV === "development"
});

module.exports = {
  entry: ["./src/index.js"],
  output: {
    path: path.resolve(__dirname, "./public/dist"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      {
        test: /\.(jpe?g|png|gif|ico)$/i,
        use: [
          {
            loader: 'file-loader?name=[name].[ext]'
          }
        ]
      },
      // {
      //   test: /\.(scss$|css$)/,
      //   use: [
      //     {
      //       loader: 'style-loader'
      //     },
      //     {
      //       loader: 'css-loader'
      //     },
      //     {
      //       loader: 'sass-loader'
      //     }
      //   ]
      // }
      {
        test: /\.(scss$|css$)/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [require.resolve('css-loader'), require.resolve('sass-loader')],
        })
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./public/index.html",
      filename: "./index.html",
      favicon: 'build/favicon.ico'
    }),
    new ExtractTextPlugin('public/styles/style.css', {
      allChunks: true
    }),
  ],
  devServer: {
    contentBase: "./public/dist"
  },
  devtool: 'cheap-module-source-map',
};
