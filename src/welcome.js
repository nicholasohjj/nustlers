import React, { useEffect, useCallback} from "react";
import { View, StyleSheet, Image } from "react-native";
import { Button, Text } from "react-native-paper";
import { supabase } from "./supabase/supabase";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
const Welcome = () => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      checkUserLoggedIn();
    }, [checkUserLoggedIn]))
    

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
      <View style={styles.contentMobile}>
        <Text style={styles.title}>Nustlers</Text>
      </View>
      <Image
        source={require("../assets/cover-image.jpg")}
        style={styles.image}
        resizeMode="cover"
        onError={() => console.log("Error loading image")}
      />
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
            style={[styles.mobileButton, styles.loginButton]}
            labelStyle={styles.loginButtonText}

            >
            Log in
          </Button>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center", // Center content vertically
    padding: 20,
    width: '100%',
    height: '100%',
  },
  contentMobile: {
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
    zIndex: 1, // Ensure text appears above the image
  },
  title: {
    fontSize: 28, // Slightly larger for better visibility
    fontWeight: "bold",
    color: "#FFFFFF", // White color for better contrast on the image
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Text shadow for readability
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  mobileButtonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    marginBottom: 20,
    zIndex: 1, // Ensure buttons appear above the image
  },
  mobileButton: {
    flex: 1,
    marginHorizontal: 5,
    minWidth: 100, // Minimum width for better touch area
    paddingHorizontal: 10, // Padding for text inside button
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
    borderRadius: 0,
  },
  mobileButtonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    marginBottom: 20,
    zIndex: 1,
  },
  mobileButton: {
    flex: 1,
    marginHorizontal: 5,
    minWidth: 100,
    paddingHorizontal: 10,
  },
  loginButton: {
    backgroundColor: "#6200ee", // A distinct background color
    borderWidth: 1,
    borderColor: "#6200ee", // Border color
    elevation: 2, // Adding elevation for a subtle shadow (optional)
  },
  loginButtonText: {
    color: "#FFFFFF", // White text color for the button label
  },
});


export default Welcome;
