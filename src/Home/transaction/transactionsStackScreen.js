import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TransactionsList from "./transactionsList";
import TransactionDetails from "./transactionDetails";

const TransactionsStack = createNativeStackNavigator();

const TransactionsStackScreen = () => {
  return (
    <TransactionsStack.Navigator
      initialRouteName="TransactionsList"
      screenOptions={{ headerShown: false }}
    >
      <TransactionsStack.Screen name="TransactionsList" component={TransactionsList} />
      <TransactionsStack.Screen name="TransactionDetails" component={TransactionDetails} />
    </TransactionsStack.Navigator>
  );
};

export default TransactionsStackScreen;
