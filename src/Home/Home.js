import { React } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EditProfile from "./editProfile";
import Content from "./content";
import Feedback from "./feedback";
import Transaction from "./transaction/transaction";
const HomeStack = createNativeStackNavigator();

const Home = () => {
  return (
    <HomeStack.Navigator
      initialRouteName="Content"
      screenOptions={{
        headerShown: false // This hides the header for all screens in this stack
      }}
    >
      <HomeStack.Screen name="Content" component={Content} />
      <HomeStack.Screen name="EditProfile" component={EditProfile} />
      <HomeStack.Screen name="Feedback" component={Feedback} />
      <HomeStack.Screen name="Transaction" component={Transaction} />

    </HomeStack.Navigator>
  );
};

export default Home;
