// entry -> output
const path = require('path');

module.exports = (env) => {
  // console.log('env,', env)
  const isProduction = env === "production";
  return {
    entry: './src/app.js',
    output: {
      path: path.join(__dirname, 'public'),  //cannot use the relative path with ./
      filename: 'bundle.js'
    },
    // module here to setup the loader, module rules (array of object)
    module:{
      rules: [{
        loader: 'babel-loader',
        test: /\.js$/, // run babel whenever sees the file ends with js
        exclude: /node_modules/
      }, {
        test: /\.scss$/,
        // use for an array of loader
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }]
    },
    devtool: isProduction ? 'source-map' : 'cheap-module-eval-source-map'
  }

};
