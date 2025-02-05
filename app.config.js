module.exports = ({ config }) => {
  const isDevelopment = process.env.NODE_ENV !== "production";
  const useEmulator = process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATOR === "true";

  const baseConfig = {
    ...config,
    extra: {
      USE_MOCK_USER: isDevelopment,
      USE_FIREBASE_EMULATOR: useEmulator,
      ...config.extra,
    },
  };

  return baseConfig;
};
