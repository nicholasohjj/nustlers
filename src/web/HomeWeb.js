import { React } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Content from "./Content";
import Account from "../Home/Account";
const HomeWebStack = createNativeStackNavigator();

const HomeWeb = () => {
  return (

    <HomeWebStack.Navigator
      initialRouteName="Content"
      screenOptions={{
        headerShown: false, // This hides the header for all screens in this stack
      }}
    >
      <HomeWebStack.Screen name="Content" component={Content} />
        <HomeWebStack.Screen name="Account" component={Account} />
    </HomeWebStack.Navigator>
  );
};

export default HomeWeb;
