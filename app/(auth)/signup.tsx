import React from "react";
import { View } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, router } from "expo-router";
import { useAuth } from "@/lib/auth/AuthContext";
import { FirebaseError } from "firebase/app";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Container } from "@/components/ui/Container";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

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
    <Container variant="flat-surface" className="flex-1 justify-center px-8 py-12">
      <Text size="3xl" weight="bold" className="text-center mb-8">
        Create Account
      </Text>

      {errors.root && (
        <Text intent="error" size="sm" className="text-center mb-4">
          {errors.root.message}
        </Text>
      )}

      <View className="mb-6">
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <Input
                variant="neu-surface"
                label="Email"
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
                autoComplete="email"
                value={value}
                onChangeText={onChange}
                isDisabled={isSubmitting}
                error={errors.email?.message}
              />
            </View>
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <Input
                variant="neu-surface"
                label="Password"
                placeholder="Enter your password"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password-new"
                value={value}
                onChangeText={onChange}
                isDisabled={isSubmitting}
                error={errors.password?.message}
              />
            </View>
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <Input
                variant="neu-surface"
                label="Confirm Password"
                placeholder="Confirm your password"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password-new"
                value={value}
                onChangeText={onChange}
                isDisabled={isSubmitting}
                error={errors.confirmPassword?.message}
              />
            </View>
          )}
        />
      </View>

      <View className="mb-8">
        <Button
          variant="neu-accent"
          onPress={handleSubmit(onSubmit)}
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
          size="lg"
          textComponent={<Text intent="button-accent">Sign Up</Text>}
          className="mb-4"
        />

        <Button
          variant="neu-raised"
          onPress={handleGoogleSignIn}
          isDisabled={isSubmitting}
          isLoading={isSubmitting}
          size="lg"
          textComponent={<Text intent="button-neutral">Continue with Google</Text>}
        />
      </View>

      <View className="flex-row justify-center items-center space-x-1">
        <Text intent="muted">Already have an account?</Text>
        <Link href="/(auth)/login" asChild>
          <Button variant="link" textComponent={<Text intent="button-link">Log In</Text>} />
        </Link>
      </View>
    </Container>
  );
}
