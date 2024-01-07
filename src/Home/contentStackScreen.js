import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SearchMap from "./search/searchMap";
import SearchList from "./search/searchList";
import Canteen from "./new_transaction/canteen";
import Stall from "./new_transaction/stall";

import TransactionsList from "./transaction/transactionsList";
import TransactionDetails from "./transaction/transactionDetails";

const ContentStack = createNativeStackNavigator();

const ContentStackScreen = () => {
  return (
    <ContentStack.Navigator
      initialRouteName="SearchMap"
      screenOptions={{ headerShown: false }}
    >
      <ContentStack.Group
        screenOptions={{ presentation: "modal" }}
        initialRouteName="SearchMap"
      >
        <ContentStack.Screen name="SearchMap" component={SearchMap} />
        <ContentStack.Screen name="SearchList" component={SearchList} />
        <ContentStack.Screen name="Canteen" component={Canteen} />
        <ContentStack.Screen name="Stall" component={Stall} />
      </ContentStack.Group>

      <ContentStack.Group
      initialRouteName="TransactionsList"
    >
      <ContentStack.Screen name="TransactionsList" component={TransactionsList} />
      <ContentStack.Screen name="TransactionDetails" component={TransactionDetails} />
    </ContentStack.Group>
    </ContentStack.Navigator>
  );
};

export default ContentStackScreen;
