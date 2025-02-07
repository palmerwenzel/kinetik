import React from "react";
import { View, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { FirebaseError } from "firebase/app";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AnimatedContainer } from "@/components/ui/AnimatedContainer";
import { Logo } from "@/components/ui/Logo";
import { ANIMATION_PRESETS, getAnimationDelay } from "@/lib/constants/animations";

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
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      className="flex-1"
    >
      <AnimatedContainer
        variant="flat-surface"
        className="flex-1 px-8 py-24"
        duration={ANIMATION_PRESETS.screen.duration}
        initialOffsetY={ANIMATION_PRESETS.screen.initialOffsetY}
      >
        <AnimatedContainer
          variant="transparent"
          padding="none"
          delay={getAnimationDelay("immediate")}
          duration={ANIMATION_PRESETS.content.duration}
          initialOffsetY={ANIMATION_PRESETS.content.initialOffsetY}
          className="items-center mb-6"
        >
          <Logo variant="neu-raised" size="lg" />
        </AnimatedContainer>

        <AnimatedContainer
          variant="transparent"
          padding="none"
          delay={getAnimationDelay("header")}
          duration={ANIMATION_PRESETS.content.duration}
          initialOffsetY={ANIMATION_PRESETS.content.initialOffsetY}
        >
          <Text size="3xl" weight="bold" className="text-center">
            Welcome Back
          </Text>

          {errors.root && (
            <Text intent="error" size="sm" className="text-center mb-2">
              {errors.root.message}
            </Text>
          )}

          <View className="flex-row justify-center items-center space-x-1 mb-4">
            <Text intent="muted">Don&apos;t have an account?</Text>
            <Link href="/(auth)/signup" asChild>
              <Button variant="link" textComponent={<Text intent="button-link">Sign Up</Text>} />
            </Link>
          </View>
        </AnimatedContainer>

        <AnimatedContainer
          variant="transparent"
          padding="none"
          delay={getAnimationDelay("content")}
          duration={ANIMATION_PRESETS.content.duration}
          initialOffsetY={ANIMATION_PRESETS.content.initialOffsetY}
          className="mb-6"
        >
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
                  autoComplete="password"
                  value={value}
                  onChangeText={onChange}
                  isDisabled={isSubmitting}
                  error={errors.password?.message}
                />
              </View>
            )}
          />
        </AnimatedContainer>

        <AnimatedContainer
          variant="transparent"
          padding="none"
          delay={getAnimationDelay("actions")}
          duration={ANIMATION_PRESETS.content.duration}
          initialOffsetY={ANIMATION_PRESETS.content.initialOffsetY}
          className="mb-8"
        >
          <Button
            variant="neu-accent"
            onPress={handleSubmit(onSubmit)}
            isDisabled={isSubmitting}
            isLoading={isSubmitting}
            size="lg"
            textComponent={<Text intent="button-accent">Log In</Text>}
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
        </AnimatedContainer>
      </AnimatedContainer>
    </ScrollView>
  );
}
