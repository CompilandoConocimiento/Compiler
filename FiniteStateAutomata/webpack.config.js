module.exports = {
    entry: './Code/Pages/App/index.jsx',
    output: {
        path: __dirname + '/Distribution',
        publicPath: '/',
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css', '.tsx', '.ts']
    },
    module: {
        rules: [
          {
            test: /\.(js|jsx|tsx|ts)$/,
            exclude: /node_modules/,
            use: 'babel-loader'
          },
          {
          test: /\.(png|jpg|gif)$/,
            use: [
              {
                loader: 'file-loader',
                options: {}  
              }
            ]
          },
          {
            test: /\.css$/,
            use: [
              {
                loader: "style-loader"
              },
              {
                loader: "css-loader",
                options: {
                  modules: true,
                  localIdentName: "[name]_[local]_[hash:base64]",
                  sourceMap: true,
                  minimize: true
                }
              },
            ]
          },
        ]
    }
};