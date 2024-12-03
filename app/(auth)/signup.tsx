import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { VStack } from "@/components/ui/vstack";
import { Input, InputField } from "@/components/ui/input";
import { Button, ButtonText } from "@/components/ui/button";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Pressable } from "@/components/ui/pressable";

const avatars = [
  "https://avatar.iran.liara.run/public/34",
  "https://avatar.iran.liara.run/public/4",
  "https://avatar.iran.liara.run/public/88",
  "https://avatar.iran.liara.run/public/57",
];

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
  });

  const router = useRouter();

  const validateInputs = () => {
    const newErrors = {
      firstName: !firstName,
      lastName: !lastName,
      email: !/^\S+@\S+\.\S+$/.test(email),
      password: password.length < 6,
    };
    setErrors(newErrors);

    return !Object.values(newErrors).some(Boolean);
  };

  const signUpWithEmail = async () => {
    if (!validateInputs()) {
      Alert.alert("Error", "Please fix the errors before submitting.");
      return;
    }

    setLoading(true);

    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            avatar: selectedAvatar,
          },
        },
      });

      if (authError) {
        Alert.alert("Sign Up Error", authError.message);
        setLoading(false);
        return;
      }

      // Check if the signup was successful and the user was created
      const userId = authData.user?.id;

      if (userId) {
        // Save the user data to the `users` table
        const { error: dbError } = await supabase.from("users").insert([
          {
            id: userId,
            email,
            first_name: firstName,
            last_name: lastName,
            avatar: selectedAvatar,
            created_at: new Date().toISOString(),
          },
        ]);

        if (dbError) {
          Alert.alert("Database Error", dbError.message);
        } else {
          router.replace("/"); // Navigate back to the Auth screen
        }
      } else {
        Alert.alert("Error", "User ID not returned from Supabase.");
      }
    } catch (error) {
      Alert.alert("Unexpected Error", (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center px-6 bg-white">
      <KeyboardAvoidingView
        behavior="padding"
        className="flex-1 w-full max-w-md items-center justify-center"
      >
        <Pressable
          className="flex-1 w-full max-w-md items-center justify-center"
          onPress={Keyboard.dismiss}
        >
          <VStack className="w-full max-w-md" space="lg">
            <Heading size="2xl" className="text-center mb-4">
              Create an Account
            </Heading>

            {/* Avatar Selection */}
            <VStack className="justify-center" space="md">
              <Heading className="text-center">Choose an avatar:</Heading>
              <Box className="flex-row justify-center mb-4">
                {avatars.map((avatar, index) => (
                  <Pressable
                    key={index}
                    onPress={() => setSelectedAvatar(avatar)}
                    className={`mr-2 ${
                      selectedAvatar === avatar
                        ? "border-primary-600 border-2 rounded-full"
                        : ""
                    }`}
                  >
                    <Avatar size="lg">
                      <AvatarImage source={{ uri: avatar }} />
                      <AvatarFallbackText />
                    </Avatar>
                  </Pressable>
                ))}
              </Box>
            </VStack>

            {/* First Name Input */}
            <FormControl isInvalid={errors.firstName}>
              <FormControlLabel>
                <FormControlLabelText>First Name</FormControlLabelText>
              </FormControlLabel>
              <Input size="lg" className="rounded-lg">
                <InputField
                  placeholder="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </Input>
              {errors.firstName && (
                <FormControlError>
                  <FormControlErrorText>
                    First name is required.
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            {/* Last Name Input */}
            <FormControl isInvalid={errors.lastName}>
              <FormControlLabel>
                <FormControlLabelText>Last Name</FormControlLabelText>
              </FormControlLabel>
              <Input size="lg" className="rounded-lg">
                <InputField
                  placeholder="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                />
              </Input>
              {errors.lastName && (
                <FormControlError>
                  <FormControlErrorText>
                    Last name is required.
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            {/* Email Input */}
            <FormControl isInvalid={errors.email}>
              <FormControlLabel>
                <FormControlLabelText>Email</FormControlLabelText>
              </FormControlLabel>
              <Input size="lg" className="rounded-lg">
                <InputField
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </Input>
              {errors.email && (
                <FormControlError>
                  <FormControlErrorText>
                    Enter a valid email address.
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
                  placeholder="Password"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </Input>
              {errors.password && (
                <FormControlError>
                  <FormControlErrorText>
                    Password must be at least 6 characters long.
                  </FormControlErrorText>
                </FormControlError>
              )}
            </FormControl>

            {/* Sign Up Button */}
            <Button
              onPress={signUpWithEmail}
              disabled={loading}
              size="lg"
              className="bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
            >
              <ButtonText>{loading ? "Signing Up..." : "Sign Up"}</ButtonText>
            </Button>

            {/* Back Button */}
            <Button
              onPress={() => router.back()}
              size="lg"
              variant="outline"
              className="border-primary-600 text-primary-600 rounded-lg"
            >
              <ButtonText>Back</ButtonText>
            </Button>
          </VStack>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
