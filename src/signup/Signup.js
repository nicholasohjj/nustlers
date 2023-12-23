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

export default Signup;