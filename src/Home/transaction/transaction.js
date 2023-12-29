import { React } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Canteen from "./canteen";
import Stall from "./stall";
const TransactionStack = createNativeStackNavigator();

const Transaction = () => {
  return (
    <TransactionStack.Navigator
      initialRouteName="Canteen"
      screenOptions={{
        headerShown: false // This hides the header for all screens in this stack
      }}
    >
      <TransactionStack.Screen name="Canteen" component={Canteen} />
      <TransactionStack.Screen name="Stall" component={Stall} />


    </TransactionStack.Navigator>
  );
};

export default Transaction;
