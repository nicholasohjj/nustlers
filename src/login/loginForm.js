import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../supabase/supabase";
import { useNavigation } from "@react-navigation/native";
import { Text, Button, TextInput } from "react-native-paper";
import { animated, useSpring } from '@react-spring/native';

const LoginForm = () => {

  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(true);

  const fade = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 1000 }, // Adjust duration as needed
  });
  
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      checkUserLoggedIn();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkUserLoggedIn = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
        navigation.navigate("Content");

    }
  };

  const navigateToSignUp = () => navigation.navigate("Signup");
  const navigateToResetPassword = () => {
    navigation.navigate("ResetPassword");
  };

  return (
    <animated.View style={[styles.container, fade]}>
      <Text style={styles.title}>Welcome back</Text>
      <Text> Enter the email associated with your account</Text>

      <TextInput
        label="Email"
        mode="outlined"
        onChangeText={setEmail}
        value={email}
        placeholder="email@address.com"
        autoCapitalize="none"
        style={styles.input}
        left={<TextInput.Icon icon="email" />}
      />
      <TextInput
        label="Password"
        mode="outlined"
        onChangeText={setPassword}
        value={password}
        secureTextEntry={passwordVisibility}
        placeholder="Password"
        autoCapitalize="none"
        style={styles.input}
        left={<TextInput.Icon icon="lock" />}
        right={
          <TextInput.Icon
            icon={passwordVisibility ? "eye-off" : "eye"}
            onPress={() => setPasswordVisibility(!passwordVisibility)}
          />
        }
      />
      <Button
        onPress={navigateToResetPassword}
        style={styles.resetPasswordPrompt}
      >
        <Text style={styles.resetPasswordText}>
          Forgot password? Reset here
        </Text>
      </Button>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button mode="contained" onPress={handleLogin} style={styles.button}>
          Sign in
        </Button>
      )}
      <Button onPress={navigateToSignUp} style={styles.signUpPrompt}>
        <Text style={styles.signUpText}>Don't have an account? Sign up</Text>
      </Button>
      </animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 12,
    alignItems: "center", // Center items horizontally
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#000000",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "white",
    width: "100%", // Ensure full width on mobile
    maxWidth: 400, // Limit width on larger screens
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
    width: Platform.OS === "web" ? "50%" : "100%", // Half width on web, full on mobile
    maxWidth: 400, // Ensure buttons are not too wide on larger screens
  },
  signUpPrompt: {
    marginTop: 20,
    textAlign: "center",
    width: "100%", // Full width to align text properly
    maxWidth: 400, // Ensure buttons are not too wide on larger screens
  },
  signUpText: {
    color: "black",
  },
  resetPasswordPrompt: {
    marginTop: 10,
    textAlign: "center",
    width: "100%", // Full width to align text properly
    maxWidth: 400, // Ensure buttons are not too wide on larger screens
  },
  resetPasswordText: {
    color: "blue", // Use a distinctive color for the link
  },
});
export default LoginForm;