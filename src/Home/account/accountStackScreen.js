import { React } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EditProfile from "./editProfile";
import Feedback from "./feedback";
import AccountOptions from "./accountOptions";
const AccountStackScreenStack = createNativeStackNavigator();

const AccountStackScreen = () => {
  return (
    <AccountStackScreenStack.Navigator
      initialRouteName="Account"
      screenOptions={{
        headerShown: false // This hides the header for all screens in this stack
      }}
    >
      <AccountStackScreenStack.Screen name="AccountOptions" component={AccountOptions} />
      <AccountStackScreenStack.Screen name="EditProfile" component={EditProfile} />
      <AccountStackScreenStack.Screen name="Feedback" component={Feedback} />

    </AccountStackScreenStack.Navigator>
  );
};

export default AccountStackScreen;
