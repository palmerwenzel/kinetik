import { View, Text, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, router } from "expo-router";
import { useAuth } from "@/lib/auth/AuthContext";
import { FirebaseError } from "firebase/app";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

// Define form validation schema
const signupSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupScreen() {
  const { signUp, signInWithGoogle } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const getFirebaseErrorMessage = (error: FirebaseError) => {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "An account with this email already exists";
      case "auth/invalid-email":
        return "Invalid email address";
      case "auth/operation-not-allowed":
        return "Email/password accounts are not enabled";
      case "auth/weak-password":
        return "Password is too weak";
      default:
        return "Failed to create account. Please try again";
    }
  };

  const createUserProfile = async (uid: string, email: string) => {
    try {
      await setDoc(doc(db, "users", uid), {
        email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error creating user profile:", error);
      throw error;
    }
  };

  const onSubmit = async (data: SignupFormData) => {
    try {
      const userCredential = await signUp(data.email, data.password);
      if (userCredential.user) {
        await createUserProfile(userCredential.user.uid, data.email);
      }
      router.replace("/(app)");
    } catch (error) {
      console.error("Signup error:", error);
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
      const userCredential = await signInWithGoogle();
      if (userCredential.user) {
        await createUserProfile(userCredential.user.uid, userCredential.user.email || "");
      }
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
      <Text className="text-2xl font-bold mb-8 text-center">Create Account</Text>

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
          <View className="mb-4">
            <Text className="text-sm font-medium mb-1">Password</Text>
            <TextInput
              className="p-3 border rounded-lg"
              placeholder="Enter your password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password-new"
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

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, value } }) => (
          <View className="mb-6">
            <Text className="text-sm font-medium mb-1">Confirm Password</Text>
            <TextInput
              className="p-3 border rounded-lg"
              placeholder="Confirm your password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="password-new"
              value={value}
              onChangeText={onChange}
              editable={!isSubmitting}
            />
            {errors.confirmPassword && (
              <Text className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</Text>
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
          <Text className="text-white text-center font-semibold">Sign Up</Text>
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
        <Text className="text-gray-600">Already have an account? </Text>
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity>
            <Text className="text-orange-500 font-semibold">Log In</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
