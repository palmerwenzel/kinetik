/**
 * Hook for accessing authentication state and user information
 */
import { useContext } from "react";
import { AuthContext } from "../lib/auth/AuthContext";

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
