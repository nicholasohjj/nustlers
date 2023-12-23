import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {StyleSheet } from "react-native";
import Content from "./Content";
import Welcome from "./Welcome";
import Login from "./Login";
import Signup from './signup/Signup'
const Stack = createNativeStackNavigator();

const Main = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // This hides the header for all screens in this stack
      }}
      initialRouteName="Welcome"
    >      
    <Stack.Screen name="Welcome" component={Welcome} />

      <Stack.Screen name="Content">
        {(props) => <Content {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Signup" component={Signup} />

    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Main;
