import React, { useState, useEffect } from "react";
import {
  Alert,
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { supabase } from "./supabase";

import { Input } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { Text, Button, TextInput } from "react-native-paper";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      navigation.navigate("Content");
    }
  };

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
  const navigateToSignUp = () => navigation.navigate("SignupForm");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to Your Account</Text>
      <TextInput
        label="Email"
        mode="outlined"
        onChangeText={setEmail}
        value={email}
        placeholder="email@address.com"
        autoCapitalize="none"
        style={styles.input}
        left={<TextInput.Icon name="email" />}
        theme={{ colors: { primary: "black", underlineColor: 'transparent', background: "white" } }}
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
        left={<TextInput.Icon name="lock" />}
        right={<TextInput.Icon name={passwordVisibility ? "eye-off" : "eye"} onPress={() => setPasswordVisibility(!passwordVisibility)} />}
        theme={{ colors: { primary: "black", underlineColor: 'transparent', background: "white" } }}
      />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 12,
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
  },
  button: {
    marginTop: 10,
    paddingVertical: 8,
  },
  signUpPrompt: {
    marginTop: 20,
    textAlign: 'center',
  },
  signUpText: {
    color: "black", // Set color of sign up text to black
  },  
});
export default Login;
