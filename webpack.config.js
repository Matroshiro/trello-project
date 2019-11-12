var webpack = require("webpack");
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
const path = require('path');
module.exports = {
   entry: "./index.js", 
output: {
    path: path.resolve("dist/assets"),
    filename: "bundle.js",
    publicPath: "assets"
},
plugins: [new OpenBrowserPlugin({url: 'http://localhost:3000'})],
devServer: {
   inline: true,
   contentBase: './dist', 
   port: 3000
},
module: { 
    rules: [
        {
           test: /\.jsx?$/,
           exclude: /(node_modules)/,
           use: [
                 {loader: 'babel-loader'}
               ]
        },
      {
         test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      }],

      }
}