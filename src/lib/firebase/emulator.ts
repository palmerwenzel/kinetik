/**
 * Firebase emulator configuration and connection utilities
 */
import { Auth, connectAuthEmulator } from "firebase/auth";
import { Firestore, connectFirestoreEmulator } from "firebase/firestore";
import { FirebaseStorage as Storage, connectStorageEmulator } from "firebase/storage";
import Constants from "expo-constants";
import { Platform } from "react-native";

// Use localhost for web, 10.0.2.2 for Android emulator, host.docker.internal for iOS simulator
const EMULATOR_HOST = Platform.select({
  android: "10.0.2.2", // Special IP for Android emulator to reach host
  ios: "localhost", // iOS simulator can use localhost
  default: "localhost", // Web and other platforms
});

const AUTH_PORT = 9099;
const FIRESTORE_PORT = 8080;
const STORAGE_PORT = 9199;

/**
 * Connect to Firebase emulators in development environment
 */
export function connectToEmulators(auth: Auth, db: Firestore, storage: Storage) {
  if (Constants.expoConfig?.extra?.useEmulator) {
    try {
      console.log("🔧 Connecting to Firebase emulators...");
      console.log(`📱 Platform: ${Platform.OS}, Host: ${EMULATOR_HOST}`);

      // Connect to Auth emulator
      connectAuthEmulator(auth, `http://${EMULATOR_HOST}:${AUTH_PORT}`, {
        disableWarnings: true,
      });
      console.log(`✅ Connected to Auth emulator on port ${AUTH_PORT}`);

      // Connect to Firestore emulator
      connectFirestoreEmulator(db, EMULATOR_HOST, FIRESTORE_PORT);
      console.log(`✅ Connected to Firestore emulator on port ${FIRESTORE_PORT}`);

      // Connect to Storage emulator
      connectStorageEmulator(storage, EMULATOR_HOST, STORAGE_PORT);
      console.log(`✅ Connected to Storage emulator on port ${STORAGE_PORT}`);
    } catch (error) {
      console.error("❌ Error connecting to emulators:", error);
      console.error("Error details:", error instanceof Error ? error.message : error);
    }
  } else {
    console.log("⏭️ Skipping emulator connection - not in development mode");
  }
}
