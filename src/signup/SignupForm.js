import React, { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { supabase } from "../supabase/supabase";
import { useNavigation } from "@react-navigation/native";
import { Text, Button, TextInput } from "react-native-paper";
import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

WebBrowser.maybeCompleteAuthSession(); // required for web only
const redirectTo = makeRedirectUri();
console.log(redirectTo);
const createSessionFromUrl = async (url) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) throw new Error(errorCode);
  const { access_token, refresh_token } = params;

  if (!access_token) return;

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
  if (error) throw error;
  return data.session;
};

const SignupForm = () => {
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(true);

  const url = Linking.useURL();
  if (url) createSessionFromUrl(url);

  const navigation = useNavigation();
  const isNumeric = (value) => {
    return /^\d+$/.test(value); // Regular expression to test if string is numeric
  };

  const handleSignUp = async () => {
    if (!email || !password || !displayName || !phone) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    if (!isNumeric(phone) || phone.length !== 8 || !(phone.startsWith('8') || phone.startsWith('9'))) {
      Alert.alert(
        "Invalid Phone Number",
        "Please enter a valid numerical phone number."
      );
      return;
    }

    setLoading(true);
    try {
      const response = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            displayName,
            phone: parseInt(phone, 10),
          },
          emailRedirectTo: redirectTo

        },
      });
      const { error } = response;
      if (error) {
        throw error;
      }
      navigation.navigate("EmailVerification");
    } catch (error) {
      Alert.alert(
        "Sign Up Error",
        error.message || "An error occurred during sign up."
      );
    } finally {
      setLoading(false);
    }
  };

  const test = async () => {
    navigation.navigate("EmailVerification");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Let's get started!</Text>
      <TextInput
        label="Name"
        mode="outlined"
        onChangeText={setDisplayName}
        value={displayName}
        placeholder="John Doe"
        style={styles.input}
        left={<TextInput.Icon icon="account" />}
      />
      <TextInput
        label="Email"
        mode="outlined"
        onChangeText={setEmail}
        value={email}
        placeholder="email@address.com"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
        left={<TextInput.Icon icon="email" />}
      />
      <TextInput
        label="Phone Number (Paynow registered)"
        mode="outlined"
        onChangeText={setPhone}
        value={phone}
        placeholder="87654321"
        autoCapitalize="none"
        keyboardType="numeric"
        style={styles.input}
        left={<TextInput.Icon icon="phone" />}
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
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button mode="contained" onPress={handleSignUp} style={styles.button}>
          Sign up
        </Button>
      )}
      <Button mode="contained" onPress={test} style={styles.button}>
        Sign up test
      </Button>
    </View>
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
    width: "100%", // Half width on web, full on mobile
    maxWidth: 400, // Ensure buttons are not too wide on larger screens
  },
});

export default SignupForm;
