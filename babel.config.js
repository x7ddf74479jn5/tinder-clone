module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "~/assets": "./src/assets",
            "~/components": "./src/components",
            "~/hooks": "./src/hooks",
            "~/screens": "./src/screens",
            "~/src": "./src",
            "~/types": "./src/types",
            "~/utils": "./src/utils",
          },
        },
      ],
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env",
        },
      ],
    ],
  };
};
