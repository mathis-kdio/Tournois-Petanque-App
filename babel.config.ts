module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      ["module-resolver", {
        "root": ["./src"],
        "alias": {
          "*": "./src/*",
          "@animations": "./src/animations",
          "@assets": "./src/assets",
          "@components": "./src/components",
          "@navigation": "./src/navigation",
          "@screens": "./src/screens",
          "@store": "./src/store",
          "@utils": "./src/utils",
        }
      }]
    ]
  }
};