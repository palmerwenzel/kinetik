/**
 * Firebase configuration and initialization
 */
import { initializeApp, getApp } from "firebase/app";
import { initializeAuth, getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import Constants from "expo-constants";
import { connectToEmulators } from "./emulator";

// Validate required Firebase configuration
const requiredConfig = [
  "firebaseApiKey",
  "firebaseAuthDomain",
  "firebaseProjectId",
  "firebaseStorageBucket",
  "firebaseMessagingSenderId",
  "firebaseAppId",
] as const;

// Check for missing configuration
const missingConfig = requiredConfig.filter(key => !Constants.expoConfig?.extra?.[key]);
if (missingConfig.length > 0) {
  console.error("❌ Missing Firebase configuration:", missingConfig.join(", "));
  throw new Error(`Missing required Firebase configuration: ${missingConfig.join(", ")}`);
}

// Firebase configuration object
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey,
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain,
  projectId: Constants.expoConfig?.extra?.firebaseProjectId,
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket,
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId,
  appId: Constants.expoConfig?.extra?.firebaseAppId,
  ...(Constants.expoConfig?.extra?.firebaseMeasurementId && {
    measurementId: Constants.expoConfig.extra.firebaseMeasurementId,
  }),
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Set up auth state observer
onAuthStateChanged(auth, user => {
  if (user) {
    // User is signed in
    console.log("👤 Auth state changed: User is signed in", user.uid);
  } else {
    // User is signed out
    console.log("👤 Auth state changed: User is signed out");
  }
});

// Initialize other Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);

// Connect to emulators in development
if (Constants.expoConfig?.extra?.useEmulator) {
  connectToEmulators(auth, db, storage);
}

// Helper function to get the Firebase app instance
export function getFirebaseApp() {
  try {
    return getApp();
  } catch {
    return initializeApp(firebaseConfig);
  }
}
