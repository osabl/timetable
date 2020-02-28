const path = require('path')
// const fs = require('fs')
const ifaces = require('os').networkInterfaces()
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const isDevMode = process.env.NODE_ENV !== 'production'

// Main const
const PATHS = {
  src: path.resolve(__dirname, 'src'),
  dist: path.resolve(__dirname, 'dist'),
  assets: 'assets/'
}

// Pages const for HtmlWebpackPlugin
// const PAGES_DIR = `${PATHS.src}/pug/pages/`
// const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.pug'))

module.exports = {
  devtool: isDevMode ? 'eval-cheap-module-source-map' : 'none',
  entry: {
    index: `${PATHS.src}/index.js`
  },
  output: {
    filename: isDevMode ? `${PATHS.assets}js/[name].js` : `${PATHS.assets}js/[name].[hash].js`,
    path: PATHS.dist,
    publicPath: '/'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendors',
          test: /node_modules/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  devServer: {
    contentBase: PATHS.dist,
    host: getMyIpV4Address(ifaces),
    port: '8081',
    overlay: {
      warnings: true,
      errors: true
    }
  },

  module: {
    rules: [{
      test: /\.pug$/,
      use: {
        loader: 'pug-loader',
        options: {
          pretty: isDevMode
        }
      }
    }, {
      test: /\.(png|jpg|gif|svg)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]'
        }
      }
    }, {
      test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]'
      }
    }, {
      test: /\.js$/,
      exclude: '/node_modules/',
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    }, {
      test: /\.(sa|sc|c)ss$/,
      use: [
        'style-loader',
        {
          loader: MiniCssExtractPlugin.loader,
          options: {
            hmr: isDevMode
          }
        },
        {
          loader: 'css-loader',
          options: {
            sourceMap: true
          }
        }, {
          loader: 'postcss-loader',
          options: {
            sourceMap: true,
            config: {
              path: './postcss.config.js'
            }
          }
        }, {
          loader: 'sass-loader',
          options: {
            sourceMap: true
          }
        }
      ]
    }]
  },

  plugins: [
    new CleanWebpackPlugin(),
    // ...PAGES.map(page => new HtmlWebpackPlugin({
    //   template: `${PAGES_DIR}/${page}`,
    //   filename: `./${page.replace(/\.pug/, '.html')}`
    // })),
    new HtmlWebpackPlugin({
      template: `${PATHS.src}/${PATHS.assets}/pug/index.pug`,
      filename: 'index.html'
    }),
    new MiniCssExtractPlugin({
      filename: isDevMode ? `${PATHS.assets}/css/[name].css` : `${PATHS.assets}/css/[name].[hash].css`
    }),
    new CopyWebpackPlugin([
      { from: `${PATHS.src}/${PATHS.assets}/img`, to: `${PATHS.assets}/img` },
      // { from: `${PATHS.src}/${PATHS.assets}fonts`, to: `${PATHS.assets}fonts` },
      { from: `${PATHS.src}/static`, to: '' }
    ])
  ]
}

function getMyIpV4Address (ifaces) {
  let myIpV4Address

  Object.keys(ifaces).forEach(dev => {
    ifaces[dev].filter(details => {
      if (details.family === 'IPv4' && details.internal === false) {
        myIpV4Address = details.address
      }
    })
  })

  return myIpV4Address
}
