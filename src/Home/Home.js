import { React } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EditProfile from "./EditProfile";
import Content from "./Content";
import Feedback from "./feedback";
const HomeStack = createNativeStackNavigator();

const Home = () => {
  return (
    <HomeStack.Navigator
      initialRouteName="DefaultHome"
      screenOptions={{
        headerShown: false // This hides the header for all screens in this stack
      }}
    >
      <HomeStack.Screen name="Content" component={Content} />
      <HomeStack.Screen name="EditProfile" component={EditProfile} />
      <HomeStack.Screen name="Feedback" component={Feedback} />

    </HomeStack.Navigator>
  );
};

export default Home;
