import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./Home/Home";
import { supabase } from "./supabase";
import { useNavigation } from "@react-navigation/native";
import Welcome from "./Welcome";
import Login from "./login/Login";
import Signup from './signup/Signup';
import HomeWeb from "./web/HomeWeb";
import { ActivityIndicator, View, Platform } from 'react-native'; // Import ActivityIndicator and View

const Stack = createNativeStackNavigator();

const Main = () => {
  const isMobile = Platform.OS !== "web";

  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [initialRouteName, setInitialRouteName] = useState('Welcome'); // State for initial route name

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setInitialRouteName(isMobile ? 'Home' : 'HomeWeb'); // Set the initial route name based on the platform
        } else {
          setInitialRouteName('Welcome');
        }
      } catch (error) {
        console.error('Error checking user login status', error);
        setInitialRouteName("Welcome");
      } finally {
        setIsLoading(false);
      }
    };

    checkUserLoggedIn();
  }, [navigation]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyHome: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={initialRouteName} // Use the state to dynamically set the initial route
    >
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="HomeWeb" component={HomeWeb} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );
};

export default Main;
