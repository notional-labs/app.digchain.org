module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
      },
    ],
  },

  resolve: {  
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      https: require.resolve("https-browserify"),
      http: require.resolve("stream-http"),
      os: require.resolve("os-browserify/browser"),
    },
  },
};``