import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Content from "./Home/content";
import { supabase } from "./supabase/supabase";
import { useNavigation } from "@react-navigation/native";
import Welcome from "./welcome";
import LoginStackScreen from "./login/loginStackScreen";
import Signup from "./signup/signup";
import { ActivityIndicator, View } from "react-native"; // Import ActivityIndicator and View
import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();

const Main = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [initialRouteName, setInitialRouteName] = useState("Welcome"); // State for initial route name

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setInitialRouteName("Content");
        } else {
          setInitialRouteName("Welcome");
        }
      } catch (error) {
        console.error("Error checking user login status", error);
        setInitialRouteName("Welcome");
      } finally {
        setIsLoading(false);
      }
    };

    checkUserLoggedIn();
  }, [navigation]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, marginTop: StatusBar.currentHeight }}>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={initialRouteName} // Use the state to dynamically set the initial route
      >
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Content" component={Content} />
        <Stack.Screen name="Login" component={LoginStackScreen} />
        <Stack.Screen name="Signup" component={Signup} />
      </Stack.Navigator>
    </View>
  );
};

export default Main;
