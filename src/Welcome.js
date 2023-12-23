import React, { useEffect } from "react";
import { View, StyleSheet, Platform, Image } from "react-native";
import { Button, Text } from "react-native-paper";
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
  const isMobile = Platform.OS !== "web";

  return (
    <View style={styles.container}>
      <View style={isMobile ? styles.contentMobile : styles.content}>
        <Text style={styles.title}>Welcome to Our App!</Text>
      </View>

      {!isMobile && (
        <>
          <Button mode="contained" onPress={handleSignUp} style={styles.button}>
            Sign up
          </Button>
          <Button mode="outlined" onPress={handleSignIn} style={styles.button}>
            Log in
          </Button>
        </>
      )}

      {isMobile && (
        <View style={styles.mobileButtonContainer}>
          <Button
            mode="contained"
            onPress={handleSignUp}
            style={styles.mobileButton}
          >
            Sign up
          </Button>
          <Button
            mode="outlined"
            onPress={handleSignIn}
            style={styles.mobileButton}
          >
            Log in
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    padding: 20,
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1, // This will allow the content to grow while leaving space for buttons

  },
  contentMobile: {
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1, // This will allow the content to grow while leaving space for buttons
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 0,
    textAlign: "center",
    color: "#000000",
  },
  button: {
    marginTop: 10,
    width: "50%",
    maxWidth: 400,
    alignSelf: "center",
  },
  mobileButtonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  mobileButton: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default Welcome;
