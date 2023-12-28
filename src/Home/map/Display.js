import { React } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Map from "./Map";
import Canteen from "./Canteen";
import Stall from "./Stall";
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
      <DisplayStack.Screen name="Canteen" component={Canteen} />
      <DisplayStack.Screen name="Stall" component={Stall} />
      <DisplayStack.Screen name="LocationSearch" component={LocationSearch} />

    </DisplayStack.Navigator>
  );
};

export default Display;
