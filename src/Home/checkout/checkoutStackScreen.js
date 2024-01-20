import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Confirmation from "./confirmation";
import Payment from "./payment";
const CheckOutStack = createNativeStackNavigator();

const CheckOutStackScreen = () => {
  return (
    <CheckOutStack.Navigator
      initialRouteName="Confirmation"
      screenOptions={{ headerShown: false }}
    >
      <CheckOutStack.Screen name="Confirmation" component={Confirmation} />
      <CheckOutStack.Screen name="Payment" component={Payment} />

    </CheckOutStack.Navigator>
  );
};

export default CheckOutStackScreen;
