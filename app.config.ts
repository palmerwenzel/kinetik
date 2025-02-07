import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  const isProduction = process.env.NODE_ENV === "production";
  const useEmulator = process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATOR === "true";

  return {
    ...config,
    name: "Kinetik",
    slug: "kinetik",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./src/assets/images/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./src/assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    scheme: "kinetik",
    ios: {
      supportsTablet: true,
      bundleIdentifier: isProduction ? "com.kinetik.app" : "com.kinetik.app.dev",
      usesAppleSignIn: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./src/assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: isProduction ? "com.kinetik.app" : "com.kinetik.app.dev",
    },
    web: {
      favicon: "./src/assets/images/favicon.png",
    },
    extra: {
      // All Firebase env variables:
      firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,

      // Emulator usage toggle:
      useEmulator,

      // Put any other relevant environment keys here:
      googleAndroidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
      googleIosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,

      // EAS config or anything else:
      eas: {
        projectId: process.env.EAS_PROJECT_ID,
      },
    },
    plugins: ["expo-router"],
  };
};
