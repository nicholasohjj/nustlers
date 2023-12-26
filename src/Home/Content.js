import React, { useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { BottomNavigation, Text } from "react-native-paper";
import { supabase } from "../supabase";
import { useNavigation } from "@react-navigation/native";
import Display from "./map/Display";
import Sample from "./Sample";
import Account from "./Account";
import Information from "./Information";

const Content = () => {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  let baseRoutes = [
    {
      key: "test",
      title: "Testing",
      focusedIcon: "heart",
      unfocusedIcon: "heart-outline",
    },
    {
      key: "map",
      title: "Map",
      focusedIcon: "map",
      unfocusedIcon: "map-outline",
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
      case "test":
        return <Sample jumpTo={jumpTo} />;
      case "map":
        return <Display jumpTo={jumpTo} />;
      case "information":
        return <Information jumpTo={jumpTo} />;
      case "account":
        return <Account jumpTo={jumpTo} />;
    }
  };

  useEffect(() => {
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
  map: {
    width: "100%",
    height: "100%",
  },
});

export default Content;
