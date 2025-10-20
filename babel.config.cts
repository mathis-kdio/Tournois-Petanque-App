module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel"
    ],
    plugins: [
      ["inline-import", { 
        "extensions": [".sql"] 
      }],
      ["module-resolver", {
        "root": ["./src"],
        "alias": {
          "*": "./src/*",
          "@animations": "./src/animations",
          "@assets": "./src/assets",
          "@components": "./src/components",
          "@navigation": "./src/navigation",
          "@screens": "./src/app",
          "@store": "./src/store",
          "@utils": "./src/utils",
        }
      }],
      'react-native-reanimated/plugin',
    ]
  }
};