/**
 * Authentication context and provider for managing user authentication state
 */
import React, { createContext, useEffect, useState } from "react";
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithCredential,
  UserCredential,
  onAuthStateChanged,
} from "firebase/auth";
import * as Google from "expo-auth-session/providers/google";
import { auth } from "../firebase/config";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";
import type { User } from "../../hooks/useAuth";

// Register for native Google auth
WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<UserCredential>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set up Google OAuth request
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: Constants.expoConfig?.extra?.googleAndroidClientId,
    iosClientId: Constants.expoConfig?.extra?.googleIosClientId,
    clientId: Constants.expoConfig?.extra?.googleWebClientId,
    responseType: "id_token",
    scopes: ["profile", "email"],
    redirectUri: `${Constants.expoConfig?.scheme}://oauth2redirect/google`,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log("🔄 Starting Google Sign-In process...");
      console.log("📋 Request details:", {
        hasAndroidId: !!Constants.expoConfig?.extra?.googleAndroidClientId,
        hasIosId: !!Constants.expoConfig?.extra?.googleIosClientId,
        hasWebId: !!Constants.expoConfig?.extra?.googleWebClientId,
      });

      const result = await promptAsync();
      console.log("📱 Google Sign-In result:", {
        type: result.type,
        params: result.type === "success" ? Object.keys(result.params) : null,
      });

      if (result.type === "success" && result.params?.id_token) {
        const { id_token } = result.params;
        console.log("✅ Received Google token");

        const credential = GoogleAuthProvider.credential(id_token);
        console.log("🔑 Created Google credential");

        const userCredential = await signInWithCredential(auth, credential);
        console.log("👤 Successfully signed in with Google", userCredential.user.email);
        return userCredential;
      } else {
        console.error("❌ Google sign in failed:", {
          type: result.type,
          params: result.type === "success" ? Object.keys(result.params) : null,
        });
        throw new Error(`Google sign in failed: ${result.type}`);
      }
    } catch (error) {
      console.error("❌ Google sign in error:", error);
      if (error instanceof Error) {
        console.error("Error details:", {
          message: error.message,
          name: error.name,
          stack: error.stack,
        });
      }
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
