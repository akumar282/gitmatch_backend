const path = require('path');

module.exports = {
  mode: 'production',
  target: 'node',
  devtool: 'inline-source-map',
  // Multiple entry points for each Lambda function
  entry: {
    matchNumberHandler: './lib/src/lambda/matchNumberHandler.ts',
    projectMatchingHandler: './lib/src/lambda/projectMatchingHandler.ts',
    federatedUserCreationHandler: './lib/src/lambda/federatedUserCreationHandler.ts',
    temporaryLikePostHandler: './lib/src/lambda/temporaryLikePostHandler.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js', // Output each bundle with its entry name
    libraryTarget: 'commonjs'
  },
  resolve: {
    extensions: ['.ts', '.js'], // Add '.ts' and '.js' as resolvable extensions.
    alias: {
      '@lib': path.resolve(__dirname, 'lib/') // Adjust this path as necessary.
    }
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env', // For JavaScript
              '@babel/preset-typescript' // For TypeScript
            ]
          }
        }
      }
    ]
  },
  optimization: {
    minimize: false
  }
};
