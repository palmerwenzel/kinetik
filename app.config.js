module.exports = ({ config }) => {
  const isDevelopment = process.env.NODE_ENV !== "production";
  const useEmulator = process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATOR === "true";

  const baseConfig = {
    ...config,
    extra: {
      USE_MOCK_USER: isDevelopment,
      USE_FIREBASE_EMULATOR: useEmulator,
      firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
      ...config.extra,
    },
  };

  return baseConfig;
};
