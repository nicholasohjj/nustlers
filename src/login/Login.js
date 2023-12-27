import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../supabase";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginForm from "./LoginForm";
import ResetPassword from "./ResetPassword";

const LoginStack = createNativeStackNavigator();

const Login = () => {
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

export default Login;