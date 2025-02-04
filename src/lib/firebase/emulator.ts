/**
 * Firebase emulator configuration and connection utilities
 */
import { connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore';
import { connectStorageEmulator } from 'firebase/storage';
import { auth, db, storage } from './config';

const EMULATOR_HOST = 'localhost';

/**
 * Connect to Firebase emulators in development environment
 */
export function connectToEmulators() {
  if (process.env.EXPO_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
    console.log('🔧 Using Firebase Emulators');
    
    // Auth Emulator
    connectAuthEmulator(auth, `http://${EMULATOR_HOST}:9099`, { disableWarnings: true });
    
    // Firestore Emulator
    connectFirestoreEmulator(db, EMULATOR_HOST, 8080);
    
    // Storage Emulator
    connectStorageEmulator(storage, EMULATOR_HOST, 9199);
  }
} 