const createExpoWebpackConfigAsync = require("@expo/webpack-config");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        // If you add modules here, they’ll be forcibly re-transpiled by Babel.
        // e.g., `dangerouslyAddModulePathsToTranspile: ["nativewind"]`
        // If you included `"expo-router"` by mistake, that could lead to errors.
        dangerouslyAddModulePathsToTranspile: ["nativewind"],
      },
    },
    argv
  );

  // Add PostCSS loader to handle Tailwind CSS
  config.module.rules.push({
    test: /\.css$/i,
    use: ["postcss-loader"],
  });

  return config;
};
