import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { BottomNavigation, Text } from "react-native-paper";
import { supabase } from "../supabase";
import { useNavigation } from "@react-navigation/native";
import Search from "./map/search";
import Transactions from "./transaction/transactions";
import Account from "./account";
import Information from "./information";

const Content = () => {
  const navigation = useNavigation();
  const initialRouteIndex = 0; // Index of 'map' route
  const [index, setIndex] = useState(0);

  let baseRoutes = [
    {
      key: "search",
      title: "Search",
      focusedIcon: "map-search",
      unfocusedIcon: "map-search-outline",
    },
    {
      key: "transaction",
      title: "Transactions",
      focusedIcon: "book",
      unfocusedIcon: "book-outline",
    },
    {
      key: "information",
      title: "Information",
      focusedIcon: "information",
      unfocusedIcon: "information-outline",
    },
    {
      key: "account",
      title: "Account",
      focusedIcon: "account",
      unfocusedIcon: "account-outline",
    }

  ];

  const [routes] = useState(baseRoutes);

  const renderScene = ({ route, jumpTo }) => {
    switch (route.key) {
      case "transaction":
        return <Transactions jumpTo={jumpTo} />;
      case "search":
        return <Search jumpTo={jumpTo} />;
      case "information":
        return <Information jumpTo={jumpTo} />;
      case "account":
        return <Account jumpTo={jumpTo} />;
    }
  };

  useEffect(() => {
    setIndex(initialRouteIndex);
    const checkUserLoggedIn = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        // Handle error if needed
      }
      if (!user) {
        navigation.navigate("Welcome");
      }
    };
    checkUserLoggedIn();

  }, [navigation]);

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  search: {
    width: "100%",
    height: "100%",
  },
});

export default Content;
