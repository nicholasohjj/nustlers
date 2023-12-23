import React, { useEffect } from "react";
import { StyleSheet } from "react-native";


import { createNativeStackNavigator } from "@react-navigation/native-stack";

import EmailVerification from "./EmailVerification";
import SignupForm from "./SignupForm";
const SignUpStack = createNativeStackNavigator();


const Signup = () => {
  return (
    <SignUpStack.Navigator
    screenOptions={{
      headerShown: false, // This hides the header for all screens in this stack
    }}
    initialRouteName="SignupForm"
  >      
  <SignUpStack.Screen name="SignupForm" component={SignupForm} />
  <SignUpStack.Screen name="EmailVerification" component={EmailVerification} />

  </SignUpStack.Navigator>
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
  title: {
    fontSize: 24, // You can adjust font size as needed
    fontWeight: "bold",
    marginBottom: 20, // Adds some space below the title
    textAlign: 'center', // Centers the title
  },
});

export default Signup;