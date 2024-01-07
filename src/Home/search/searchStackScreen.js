import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SearchMap from "./searchMap";
import SearchList from "./searchList";
import Canteen from "../new_transaction/canteen";
import Stall from "../new_transaction/stall";

const SearchStack = createNativeStackNavigator();

const SearchStackScreen = () => {
  return (
    <SearchStack.Navigator
      initialRouteName="SearchMap"
      screenOptions={{ headerShown: false }}
    >
      <SearchStack.Screen name="SearchMap" component={SearchMap} />
      <SearchStack.Screen name="SearchList" component={SearchList} />
      <SearchStack.Screen name="Canteen" component={Canteen} />
      <SearchStack.Screen name="Stall" component={Stall} />

    </SearchStack.Navigator>
  );
};

export default SearchStackScreen;
