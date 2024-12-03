import React, { useState } from "react";
import {
  Alert,
  AppState,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { supabase } from "@/lib/supabase";
import { VStack } from "@/components/ui/vstack";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { MaterialIcons } from "@expo/vector-icons";
import { Spinner } from "@/components/ui/spinner";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { useRouter } from "expo-router";

// Auto-refresh session when app is active
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: false, password: false });

  const router = useRouter();

  const validateInputs = () => {
    const newErrors = {
      email: !/^\S+@\S+\.\S+$/.test(email),
      password: password.length < 6,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const signInWithEmail = async () => {
    if (!validateInputs()) {
      Alert.alert("Error", "Please fix the errors before signing in.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert("Sign In Error", error.message);
    }

    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 items-center justify-center px-6 bg-white">
        <VStack className="w-full max-w-md" space="lg">
          <Heading size="2xl" className="text-center mb-4">
            Welcome to MessageBoard
          </Heading>

          {/* Email Input */}
          <FormControl isInvalid={errors.email}>
            <FormControlLabel>
              <FormControlLabelText>Email</FormControlLabelText>
            </FormControlLabel>
            <Input size="lg" className="rounded-lg">
              <InputSlot className="pl-3">
                <InputIcon
                  as={() => <MaterialIcons name="email" size={20} />}
                />
              </InputSlot>
              <InputField
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </Input>
            {errors.email && (
              <FormControlError>
                <FormControlErrorText>
                  Please enter a valid email address.
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          {/* Password Input */}
          <FormControl isInvalid={errors.password}>
            <FormControlLabel>
              <FormControlLabelText>Password</FormControlLabelText>
            </FormControlLabel>
            <Input size="lg" className="rounded-lg">
              <InputField
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <InputSlot
                className="pr-3"
                onPress={() => setShowPassword(!showPassword)}
              >
                <InputIcon
                  as={() =>
                    showPassword ? (
                      <MaterialIcons name="visibility" size={20} />
                    ) : (
                      <MaterialIcons name="visibility-off" size={20} />
                    )
                  }
                />
              </InputSlot>
            </Input>
            {errors.password && (
              <FormControlError>
                <FormControlErrorText>
                  Password must be at least 6 characters.
                </FormControlErrorText>
              </FormControlError>
            )}
          </FormControl>

          {/* Sign In Button */}
          <Button
            onPress={signInWithEmail}
            disabled={loading}
            size="lg"
            className="bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white rounded-lg"
          >
            {loading ? (
              <Spinner color="white" />
            ) : (
              <ButtonText>Sign In</ButtonText>
            )}
          </Button>

          {/* Sign Up Button */}
          <Button
            onPress={() => router.push("/signup")}
            disabled={loading}
            size="lg"
            variant="outline"
            className="border-primary-600 text-primary-600 rounded-lg"
          >
            <ButtonText>Sign Up</ButtonText>
          </Button>
        </VStack>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
