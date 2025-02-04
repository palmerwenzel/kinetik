import { View, Text, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, router } from "expo-router";
import { useAuth } from "@/lib/auth/AuthContext";
import { FirebaseError } from "firebase/app";

// Define form validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const { signIn, signInWithGoogle } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const getFirebaseErrorMessage = (error: FirebaseError) => {
    switch (error.code) {
      case "auth/invalid-email":
        return "Invalid email address";
      case "auth/user-disabled":
        return "This account has been disabled";
      case "auth/user-not-found":
        return "No account found with this email";
      case "auth/wrong-password":
        return "Invalid password";
      case "auth/too-many-requests":
        return "Too many attempts. Please try again later";
      default:
        return "Failed to sign in. Please try again";
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      await signIn(data.email, data.password);
      router.replace("/(app)");
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof FirebaseError) {
        setError("root", {
          message: getFirebaseErrorMessage(error),
        });
      } else {
        setError("root", {
          message: "An unexpected error occurred",
        });
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.replace("/(app)");
    } catch (error) {
      console.error("Google sign in error:", error);
      if (error instanceof FirebaseError) {
        setError("root", {
          message: getFirebaseErrorMessage(error),
        });
      } else {
        setError("root", {
          message: "Failed to sign in with Google",
        });
      }
    }
  };

  return (
    <View className="flex-1 justify-center p-4 bg-white">
      <Text className="text-2xl font-bold mb-8 text-center">Welcome Back</Text>

      {errors.root && (
        <Text className="text-red-500 text-sm mb-4 text-center">{errors.root.message}</Text>
      )}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <View className="mb-4">
            <Text className="text-sm font-medium mb-1">Email</Text>
            <TextInput
              className="p-3 border rounded-lg"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              autoComplete="email"
              value={value}
              onChangeText={onChange}
              editable={!isSubmitting}
            />
            {errors.email && (
              <Text className="text-red-500 text-sm mt-1">{errors.email.message}</Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <View className="mb-6">
            <Text className="text-sm font-medium mb-1">Password</Text>
            <TextInput
              className="p-3 border rounded-lg"
              placeholder="Enter your password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password"
              value={value}
              onChangeText={onChange}
              editable={!isSubmitting}
            />
            {errors.password && (
              <Text className="text-red-500 text-sm mt-1">{errors.password.message}</Text>
            )}
          </View>
        )}
      />

      <TouchableOpacity
        className="bg-orange-500 p-4 rounded-lg mb-4"
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-semibold">Log In</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-blue-500 p-4 rounded-lg mb-4"
        onPress={handleGoogleSignIn}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-semibold">Continue with Google</Text>
        )}
      </TouchableOpacity>

      <View className="flex-row justify-center">
        <Text className="text-gray-600">Don't have an account? </Text>
        <Link href="/(auth)/signup" asChild>
          <TouchableOpacity>
            <Text className="text-orange-500 font-semibold">Sign Up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
