module.exports = {
    entry: './dist/jsx/site.jsx',
    output: {
      filename: 'site_bundle.js',
      path: __dirname + '/dist/jsx_builds/', // Create a 'dist' directory to store bundled files
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
      ],
    }
  };