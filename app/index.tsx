import { Redirect } from "expo-router";
import { useAuth } from "@/lib/auth/AuthContext";
import "../global.css";

export default function Index() {
  const { user } = useAuth();

  // Redirect to app index or login based on auth state
  return <Redirect href={user ? "/(app)" : "/(auth)/login"} />;
}
