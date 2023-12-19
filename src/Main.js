import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Welcome from "./screens/Welcome";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Dashboard from "./screens/Dashboard";

const Stack = createNativeStackNavigator()

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
  },
});

const Main = () => {
  return (
    <Stack.Navigator  screenOptions={{headerShown: false}}  initialRouteName = "Dashboard">
    <Stack.Screen name="Welcome" component={Welcome} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Signup" component={Signup} />
    <Stack.Screen name="Dashboard" component={Dashboard} />
    </Stack.Navigator>

    );
}

export default Main
