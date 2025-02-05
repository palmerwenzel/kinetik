import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView } from "react-native";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "@/lib/auth/AuthContext";
import { FirebaseError } from "firebase/app";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase/config";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { AnimatedContainer } from "@/components/ui/AnimatedContainer";
import { ANIMATION_PRESETS, getAnimationDelay } from "@/lib/constants/animations";
import Constants from "expo-constants";
import { NameStep } from "@/components/profile-setup/NameStep";
import { PhotoStep } from "@/components/profile-setup/PhotoStep";
import { InterestsStep } from "@/components/profile-setup/InterestsStep";
import { ProgressIndicator } from "@/components/ui/ProgressIndicator";
import { SuccessOverlay } from "@/components/ui/SuccessOverlay";

// Define form validation schema for each step
const nameSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

type NameFormData = z.infer<typeof nameSchema>;

type Step = "name" | "photo" | "interests";

// Mock user for development
const MOCK_USER = {
  uid: "mock-user-id",
  email: "test@example.com",
};

const SETUP_STEPS = [
  { value: 1, label: "Name" },
  { value: 2, label: "Photo" },
  { value: 3, label: "Interests" },
];

export default function ProfileSetupScreen() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>("name");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // Use mock user in development
  const activeUser = Constants.expoConfig?.extra?.USE_MOCK_USER ? MOCK_USER : user;

  useEffect(() => {
    setIsFirstRender(false);
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NameFormData>({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const updateUserProfile = async (data: NameFormData) => {
    if (!activeUser) {
      setError("User not found");
      return;
    }

    try {
      await updateDoc(doc(db, "users", activeUser.uid), {
        firstName: data.firstName,
        lastName: data.lastName,
        updatedAt: new Date().toISOString(),
      });
      setCurrentStep("photo");
    } catch (error) {
      console.error("Error updating user profile:", error);
      if (error instanceof FirebaseError) {
        setError(error.message);
      } else {
        setError("Failed to update profile");
      }
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      setError("Permission to access gallery was denied");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
      setError(null);
    }
  };

  const uploadPhoto = async () => {
    if (!photoUri || !activeUser) return;

    setIsUploading(true);
    setError(null);

    try {
      const response = await fetch(photoUri);
      const blob = await response.blob();

      const storageRef = ref(storage, `profile-photos/${activeUser.uid}`);
      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);

      await updateDoc(doc(db, "users", activeUser.uid), {
        photoURL: downloadURL,
        updatedAt: new Date().toISOString(),
      });

      setCurrentStep("interests");
    } catch (error) {
      console.error("Error uploading photo:", error);
      if (error instanceof FirebaseError) {
        setError(error.message);
      } else {
        setError("Failed to upload photo");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleInterestToggle = useCallback((interestId: string) => {
    setSelectedInterests(prev => {
      if (prev.includes(interestId)) {
        return prev.filter(id => id !== interestId);
      }
      // Limit to 5 interests
      if (prev.length >= 5) return prev;
      return [...prev, interestId];
    });
  }, []);

  const saveInterests = async () => {
    if (!activeUser) return;

    setIsUploading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Validate required data
      if (selectedInterests.length === 0) {
        setError("Please select at least one interest");
        return;
      }

      // Update user profile with interests
      await updateDoc(doc(db, "users", activeUser.uid), {
        interests: selectedInterests,
        isProfileComplete: true,
        updatedAt: new Date().toISOString(),
      });

      // Show success message
      setError(null);
      setSuccessMessage("Profile completed successfully!");
    } catch (error) {
      console.error("Error saving interests:", error);
      if (error instanceof FirebaseError) {
        setError(error.message);
      } else {
        setError("Failed to save interests");
      }
      setSuccessMessage(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirm = () => {
    router.replace("/(app)");
  };

  const getStepNumber = useCallback((step: Step): number => {
    switch (step) {
      case "name":
        return 1;
      case "photo":
        return 2;
      case "interests":
        return 3;
      default:
        return 1;
    }
  }, []);

  // Development-only: Skip auth check
  if (!activeUser && !Constants.expoConfig?.extra?.USE_MOCK_USER) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text intent="error" className="text-center mb-4">
          Please sign in to access this page
        </Text>
        <Button
          variant="neu-pressed"
          textComponent={<Text intent="button-accent">Go to Login</Text>}
          onPress={() => router.replace("/(auth)/login")}
        />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        className="flex-1"
      >
        <AnimatedContainer
          variant="flat-surface"
          className="flex-1 px-8 py-12"
          duration={isFirstRender ? ANIMATION_PRESETS.screen.duration : 0}
          initialOffsetY={isFirstRender ? ANIMATION_PRESETS.screen.initialOffsetY : 0}
        >
          <View className="items-center mb-6">
            <Logo variant="neu-raised" size="lg" />
          </View>

          <View className="items-center mb-6">
            <ProgressIndicator
              steps={SETUP_STEPS}
              currentStep={getStepNumber(currentStep)}
              size="md"
              onStepPress={step => {
                // Convert numeric step back to Step type
                let newStep: Step;
                switch (step) {
                  case 1:
                    newStep = "name";
                    break;
                  case 2:
                    newStep = "photo";
                    break;
                  case 3:
                    newStep = "interests";
                    break;
                  default:
                    newStep = "name";
                }
                setCurrentStep(newStep);
              }}
            />
          </View>

          <View className="mb-6">
            <Text size="3xl" weight="bold" className="text-center mb-2">
              Complete Your Profile
            </Text>
            <Text intent="muted" className="text-center mb-6">
              Let&apos;s get to know you better
            </Text>

            {error && (
              <Text intent="error" size="sm" className="text-center mb-4">
                {error}
              </Text>
            )}

            {successMessage && (
              <Text intent="accent" size="sm" className="text-center mb-4">
                {successMessage}
              </Text>
            )}
          </View>

          <View className="mb-6">
            {currentStep === "name" && (
              <AnimatedContainer
                variant="transparent"
                padding="none"
                delay={isFirstRender ? getAnimationDelay("content") : 0}
                duration={300}
                initialOffsetY={20}
              >
                <NameStep
                  control={control}
                  errors={errors}
                  isSubmitting={isSubmitting}
                  onSubmit={handleSubmit(updateUserProfile)}
                />
              </AnimatedContainer>
            )}

            {currentStep === "photo" && (
              <AnimatedContainer
                variant="transparent"
                padding="none"
                delay={0}
                duration={300}
                initialOffsetY={20}
              >
                <PhotoStep
                  photoUri={photoUri}
                  isUploading={isUploading}
                  onPickImage={pickImage}
                  onUploadPhoto={uploadPhoto}
                />
              </AnimatedContainer>
            )}

            {currentStep === "interests" && (
              <AnimatedContainer
                variant="transparent"
                padding="none"
                delay={0}
                duration={300}
                initialOffsetY={20}
              >
                <InterestsStep
                  selectedInterests={selectedInterests}
                  onToggleInterest={handleInterestToggle}
                  onComplete={saveInterests}
                  isLoading={isUploading}
                />
              </AnimatedContainer>
            )}
          </View>
        </AnimatedContainer>
      </ScrollView>

      {successMessage && (
        <View className="absolute inset-0">
          <SuccessOverlay message={successMessage} onConfirm={handleConfirm} />
        </View>
      )}
    </View>
  );
}
