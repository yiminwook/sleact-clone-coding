import { resolve, join } from 'path';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import {
  Configuration as WebpackConfiguration,
  EnvironmentPlugin,
  HotModuleReplacementPlugin,
  LoaderOptionsPlugin,
} from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const isDevelopment = process.env.NODE_ENV !== 'production';

const config: Configuration = {
  name: 'sleact_front',
  mode: isDevelopment ? 'development' : 'production',
  devtool: !isDevelopment ? 'hidden-source-map' : 'eval',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@hooks': resolve(__dirname, 'hooks'),
      '@components': resolve(__dirname, 'components'),
      '@layouts': resolve(__dirname, 'layouts'),
      '@pages': resolve(__dirname, 'pages'),
      '@utils': resolve(__dirname, 'utils'),
      '@typings': resolve(__dirname, 'typings'),
    },
  },
  entry: {
    app: './client',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env', //브라우저 지원
              {
                targets: { browsers: ['last 2 chrome versions'] },
                debug: isDevelopment,
              },
            ],
            '@babel/preset-react',
            '@babel/preset-typescript',
          ],
          env: {
            development: {
              plugins: [require.resolve('react-refresh/babel')],
            },
          },
        },
        exclude: join(__dirname, 'node_modules'),
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({ async: false }), //ts, webpack 작업을 동시에
    new EnvironmentPlugin({ NODE_ENV: isDevelopment ? 'development' : 'production' }),
  ],
  output: {
    path: join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/dist/',
  },
  devServer: {
    historyApiFallback: true, //react router
    port: 3090,
    devMiddleware: { publicPath: '/dist/' },
    static: { directory: resolve(__dirname) },
  },
};

if (isDevelopment && config.plugins) {
  config.plugins.push(new HotModuleReplacementPlugin());
  config.plugins.push(new ReactRefreshWebpackPlugin());
  config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'server', openAnalyzer: false }));
}

if (!isDevelopment && config.plugins) {
  config.plugins.push(new LoaderOptionsPlugin({ minimize: true }));
  config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'static' }));
}

export default config;
