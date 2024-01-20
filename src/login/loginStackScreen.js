import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../supabase/supabase";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginForm from "./loginForm";
import ResetPassword from "./resetPassword";

const LoginStack = createNativeStackNavigator();

const LoginStackScreen = () => {
  const navigation = useNavigation();

  const checkUserLoggedIn = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
        navigation.navigate("Home");
    }
  };

  useEffect(() => {
    checkUserLoggedIn();
  }, []);


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

export default LoginStackScreen;