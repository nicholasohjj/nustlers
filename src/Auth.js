import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, View, ActivityIndicator } from "react-native";
import { supabase } from "./supabase";
import { Button, Input } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

const Auth = () => {
  const [displayName, setdisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    checkUserLoggedIn();
  }, []);


  const checkUserLoggedIn = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      navigation.navigate('Home');
    }
  };

  const handleAuth = async (action) => {
    if (!email || !password) {
      Alert.alert("Please enter both email and password.");
      return;
    }

    setLoading(true);
    let response;

    try {
      if (action === "signIn") {
        response = await supabase.auth.signInWithPassword({ email, password });
      } else {
        response = await supabase.auth.signUp({ 
          email: email,
          password: password,
          phone: "87654321",
          options: {
            data: {
              displayName: displayName,
            },
          }
        });
      }
      const { error, user, session } = response;
      if (error) {
        if (error.status === 401) {
          // Check for unauthorized status code
          Alert.alert("Authentication Error", "Incorrect email or password.");
        } else {
          Alert.alert("Authentication Error", error.message);
        }
        setLoading(false);
        return;
      }

      checkUserLoggedIn()
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "An error occurred during authentication."
      );
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Input
        label="Name"
        leftIcon={{ type: "font-awesome", name: "envelope" }}
        onChangeText={setdisplayName}
        value={displayName}
        placeholder="John"
        autoCapitalize="none"
      />
      <Input
        label="Email"
        leftIcon={{ type: "font-awesome", name: "envelope" }}
        onChangeText={setEmail}
        value={email}
        placeholder="email@address.com"
        autoCapitalize="none"
      />
      <Input
        label="Password"
        leftIcon={{ type: "font-awesome", name: "lock" }}
        rightIcon={{
          type: "font-awesome",
          name: passwordVisibility ? "eye-slash" : "eye",
          onPress: () => setPasswordVisibility(!passwordVisibility),
        }}
        onChangeText={setPassword}
        value={password}
        secureTextEntry={passwordVisibility}
        placeholder="Password"
        autoCapitalize="none"
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Button title="Sign in" onPress={() => handleAuth("signIn")} />
          <Button title="Sign up" onPress={() => handleAuth("signUp")} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});

export default Auth;
