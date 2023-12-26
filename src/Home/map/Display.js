import { React } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Map from "./Map";
import Details from "./Details";
import LocationSearch from "./LocationSearch";
const DisplayStack = createNativeStackNavigator();

const Display = () => {
  return (
    <DisplayStack.Navigator
      initialRouteName="Map"
      screenOptions={{
        headerShown: false // This hides the header for all screens in this stack
      }}
    >
      <DisplayStack.Screen name="Map" component={Map} />
      <DisplayStack.Screen name="Details" component={Details} />
      <DisplayStack.Screen name="LocationSearch" component={LocationSearch} />

    </DisplayStack.Navigator>
  );
};

export default Display;
