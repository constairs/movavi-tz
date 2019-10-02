const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const PostCssFlexbugsFixes = require('postcss-flexbugs-fixes');

const htmlPlugin = new HtmlWebPackPlugin({
  template: './src/index.html',
  filename: './index.html',
  title: 'movavi-tz',
  hash: false,
});


const isDevelopment = process.env.NODE_ENV !== 'production';
const devtool = !isDevelopment ? 'cheap-module-eval-source-map' : 'source-map';

const resolve = {
  extensions: ['*', '.ts', '.tsx', '.js', '.jsx', '.json']
};

/* Configuration */

module.exports = () => {
  /* Export */
  const plugins = [
    htmlPlugin,
    new webpack.HashedModuleIdsPlugin(),
  ];

  return {
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/,
          use: [
            'style-loader',
            'css-loader',
            'sass-loader',
            {
              loader: require.resolve('postcss-loader'),
              options: {
                ident: 'postcss',
                plugins: () => [
                  PostCssFlexbugsFixes,
                  autoprefixer({
                    browsersList: [
                      '>1%',
                      'last 4 versions',
                      'Firefox ESR',
                      'not ie < 11',
                    ],
                    flexbox: 'no-2009',
                  }),
                ],
              },
            },
          ],
        },
        {
          test: /\.(ts|tsx|js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        },
        {
          test: /\.(png|svg|jpe?g|gif)$/,
          loader: 'url-loader?limit=100000',
        },
        {
          test: /\.(eot|ttf|woff|woff2|otf)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        },
      ]
    },
    devtool,
    resolve,
    plugins,
    entry: {
      app: './src/app.js',
    },
    output: {
      publicPath: '/',
      filename: isDevelopment ? '[name].[hash].js' : '[name].[contenthash].js',
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
            reuseExistingChunk: true,
          },
          commons: {
            name: 'commons',
            chunks: 'initial',
            minChunks: 2,
            minSize: 0,
            reuseExistingChunk: true,
          }
        }
      },
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true
        }),
        new OptimizeCSSAssetsPlugin({})
      ],
      occurrenceOrder: true
    },
    devServer: {
      historyApiFallback: true,
      port: 8001,
      contentBase: 'dist',
      publicPath: '/',
      hot: true,
    },
  };
};
