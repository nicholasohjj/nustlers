import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { supabase } from "./supabase";
import { useNavigation } from "@react-navigation/native";

const Welcome = () => {
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
  const handleSignIn = async () => {
    navigation.navigate("Login");
  };

  const handleSignUp = async () => {
    navigation.navigate("Signup");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Our App!</Text>
      <Button 
        mode="contained" 
        onPress={handleSignUp} 
        style={styles.button}
      >
        Sign up
      </Button>
      <Button 
        mode="outlined" 
        onPress={handleSignIn} 
        style={styles.button}
      >
        Log in
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    width: '80%',
  },
});


export default Welcome;
