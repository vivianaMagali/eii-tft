const path = require("path");

module.exports = {
  entry: "./src/firebase-messaging-sw.js",
  output: {
    filename: "firebase-messaging-sw.js",
    path: path.resolve(__dirname, "public"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
