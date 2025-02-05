import { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithCredential,
  UserCredential,
} from "firebase/auth";
import * as Google from "expo-auth-session/providers/google";
import { AuthSessionResult } from "expo-auth-session";
import { auth } from "../firebase/config";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
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
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
      setIsLoading(false);
    });

    return unsubscribe;
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
        // Redact actual IDs but log if they exist
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

        // Create a Google credential with the token
        const credential = GoogleAuthProvider.credential(id_token);
        console.log("🔑 Created Google credential");

        // Sign in with the credential
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
