import React, { useEffect } from "react";
import { StyleSheet } from "react-native";


import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginForm from "./LoginForm";
import ResetPassword from "./ResetPassword";

const LoginStack = createNativeStackNavigator();


const Login = () => {
  return (
    <LoginStack.Navigator
    screenOptions={{
      headerShown: false, // This hides the header for all screens in this stack
    }}
    initialRouteName="LoginForm"
  >      
  <LoginStack.Screen name="LoginForm" component={LoginForm} />
  <LoginStack.Screen name="ResetPassword" component={ResetPassword} />

  </LoginStack.Navigator>
  );
};

export default Login;