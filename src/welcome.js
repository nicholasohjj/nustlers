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
        <Text style={styles.title}>NUSTLERS</Text>
        <Text variant="titleLarge">Why queue, just nustle!</Text>
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
    fontSize: 30,
    fontWeight: "bold",
    color: "#333", // A color that contrasts well with your background
    marginBottom: 10, // Add some space below the title
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
    backgroundColor: "#6200ee", // Or use your app's primary color
    borderWidth: 1,
    borderColor: "#6200ee",
  },
  loginButtonText: {
    color: "#FFFFFF",
  },
});


export default Welcome;
