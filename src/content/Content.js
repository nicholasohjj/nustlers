import { React } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EditProfile from "../EditProfile";
import DefaultContent from "./DefaultContent";
const ContentStack = createNativeStackNavigator();

const Content = () => {
  return (
    <ContentStack.Navigator
      initialRouteName="DefaultContent"
      screenOptions={{
        headerShown: false // This hides the header for all screens in this stack
      }}
    >
      <ContentStack.Screen name="DefaultContent" component={DefaultContent} />
      <ContentStack.Screen name="EditProfile" component={EditProfile} />
    </ContentStack.Navigator>
  );
};

export default Content;
