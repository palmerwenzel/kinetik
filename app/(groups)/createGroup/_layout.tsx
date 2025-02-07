import { View } from "react-native";
import { Stack, useRouter, usePathname } from "expo-router";
import { Container } from "@/components/ui/Container";
import { ProgressIndicator } from "@/components/ui/ProgressIndicator";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { STEPS } from "./constants";
import { useCreateGroupForm } from "@/hooks/useCreateGroupForm";
import { createContext, useContext } from "react";
import type { FormData } from "@/hooks/useCreateGroupForm";
import type { Step } from "./constants";
import React from "react";
import { basicsSchema, visibilitySchema, postingSchema } from "@/schemas/group";

interface CreateGroupFormContext {
  form: ReturnType<typeof useCreateGroupForm>["form"];
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting: boolean;
}

const FormContext = createContext<CreateGroupFormContext | null>(null);

export function useCreateGroupFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useCreateGroupFormContext must be used within a CreateGroupFormProvider");
  }
  return context;
}

// Step Header Component
interface StepHeaderProps {
  step: (typeof STEPS)[number];
}

function StepHeader({ step }: StepHeaderProps) {
  return (
    <View className="mb-8">
      <Text size="2xl" weight="bold" className="mb-1 text-center">
        {step.title}
      </Text>
      <Text intent="muted" className="text-center">
        {step.description}
      </Text>
    </View>
  );
}

// Step Navigation Component
interface StepNavigationProps {
  onBack?: () => void;
  onNext: () => void;
  showBack?: boolean;
  nextLabel?: string;
  isLoading?: boolean;
  isNextDisabled?: boolean;
}

function StepNavigation({
  onBack,
  onNext,
  showBack = true,
  nextLabel = "Continue",
  isLoading = false,
  isNextDisabled = false,
}: StepNavigationProps) {
  return (
    <View className="flex-row gap-4 mt-8">
      {showBack && onBack && (
        <Button variant="neu-pressed" className="flex-1" onPress={onBack}>
          <Text>Back</Text>
        </Button>
      )}
      <Button
        variant="neu-accent"
        className="flex-1"
        onPress={onNext}
        isLoading={isLoading}
        isDisabled={isNextDisabled}
      >
        <Text intent="button-accent">{nextLabel}</Text>
      </Button>
    </View>
  );
}

export default function CreateGroupLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { form, onSubmit, isSubmitting } = useCreateGroupForm();
  const {
    trigger,
    getValues,
    watch,
    formState: { errors },
  } = form;

  // Add state for validation
  const [isStepValid, setIsStepValid] = React.useState(false);

  // Get current step index
  const currentStepIndex = STEPS.findIndex(step => pathname.includes(step.id));
  const currentStep = STEPS[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  // Check if current step is valid
  const checkStepValidity = React.useCallback(() => {
    const values = getValues();
    console.log("Checking step validity:", {
      currentStep: currentStep?.id,
      values,
    });

    switch (currentStep?.id) {
      case "basics": {
        const result = basicsSchema.safeParse(values);
        console.log("Basics validation:", {
          success: result.success,
          errors: !result.success ? result.error.flatten() : null,
        });
        return result.success;
      }
      case "visibility": {
        const result = visibilitySchema.safeParse(values);
        console.log("Visibility validation:", {
          success: result.success,
          errors: !result.success ? result.error.flatten() : null,
        });
        return result.success;
      }
      case "posting": {
        const result = postingSchema.safeParse(values);
        console.log("Posting validation:", {
          success: result.success,
          errors: !result.success ? result.error.flatten() : null,
        });
        return result.success;
      }
      case "review":
        return true;
      default:
        return false;
    }
  }, [currentStep?.id, getValues]);

  // Watch form values for changes and update validation
  React.useEffect(() => {
    const subscription = watch(() => {
      const newIsValid = checkStepValidity();
      setIsStepValid(newIsValid);
    });

    // Check initial validity
    const initialValidity = checkStepValidity();
    setIsStepValid(initialValidity);

    return () => subscription.unsubscribe();
  }, [watch, checkStepValidity]);

  const progressSteps = STEPS.map((step, index) => ({
    label: step.title,
    value: index + 1,
  }));

  const handleStepPress = (step: number) => {
    const stepRoute = STEPS[step - 1].id;
    router.push(`./${stepRoute}`);
  };

  const handleNext = async () => {
    // If we're on the review step, submit the form
    if (isLastStep) {
      try {
        const isValid = await trigger();
        console.log("Review validation:", { isValid });
        if (isValid) {
          await form.handleSubmit(onSubmit)();
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        // The error will be shown in the review step
      }
      return;
    }

    // Validate the current step
    let isStepValid = false;
    switch (currentStep.id) {
      case "basics":
        isStepValid = await trigger(["name", "description", "category"]);
        break;
      case "visibility":
        isStepValid = await trigger(["visibility"]);
        break;
      case "posting":
        isStepValid = await trigger(["postingGoal"]);
        break;
      default:
        isStepValid = true;
    }

    console.log("Step validation on next:", {
      step: currentStep.id,
      isStepValid,
    });

    // Only proceed if the current step is valid
    if (isStepValid) {
      const nextStep = STEPS[currentStepIndex + 1];
      router.push(`./${nextStep.id}`);
    }
  };

  const handleBack = () => {
    const prevStep = STEPS[currentStepIndex - 1];
    router.push(`./${prevStep.id}`);
  };

  return (
    <FormContext.Provider value={{ form, onSubmit, isSubmitting }}>
      <Container variant="flat-surface" className="flex-1">
        {/* Progress Section - Fixed at top */}
        <View className="px-4 pt-24 items-center">
          <View className="w-full max-w-sm">
            <ProgressIndicator
              steps={progressSteps}
              currentStep={currentStepIndex + 1}
              onStepPress={handleStepPress}
              className="mb-8"
            />
            {currentStep && <StepHeader step={currentStep} />}
          </View>
        </View>

        {/* Content Area */}
        <View className="flex-1 px-4">
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "none",
              gestureEnabled: true,
              gestureDirection: "horizontal",
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="basics" options={{ headerShown: false }} />
            <Stack.Screen name="visibility" options={{ headerShown: false }} />
            <Stack.Screen name="posting" options={{ headerShown: false }} />
            <Stack.Screen name="review" options={{ headerShown: false }} />
          </Stack>
        </View>

        {/* Navigation - Fixed at bottom */}
        <View className="px-4 py-4">
          <StepNavigation
            showBack={!isFirstStep}
            onBack={handleBack}
            onNext={handleNext}
            nextLabel={isLastStep ? "Create Group" : "Continue"}
            isLoading={isSubmitting}
            isNextDisabled={!isStepValid}
          />
        </View>
      </Container>
    </FormContext.Provider>
  );
}
