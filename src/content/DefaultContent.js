import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, } from "react-native";
import { BottomNavigation, Text, Button } from "react-native-paper";
import { supabase } from "../supabase";
import { useNavigation } from "@react-navigation/native";
import Map from "./Map";
import Sample from "./Sample";

const RecentsRoute = () => <Text>Recents</Text>;

const NotificationsRoute = () => <Text>Notifications</Text>;

const DefaultContent = () => {
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();
  const [routes] = useState([
    {
      key: "test",
      title: "Testing",
      focusedIcon: "heart",
      unfocusedIcon: "heart-outline",
    },
    { key: "map", title: "Map", focusedIcon: "map" },
    { key: "recents", title: "Recents", focusedIcon: "history" },
    {
      key: "notifications",
      title: "Notifications",
      focusedIcon: "bell",
      unfocusedIcon: "bell-outline",
    },
  ]);
  const [index, setIndex] = useState(0);

  const renderScene = ({ route, jumpTo }) => {
    switch (route.key) {
      case "test":
        return <Sample jumpTo={jumpTo} userData={userData} />;
      case "map":
        return <Map jumpTo={jumpTo} />;
      case "recents":
        return <RecentsRoute jumpTo={jumpTo} />;
      case "notifications":
        return <NotificationsRoute jumpTo={jumpTo} />;
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
      if (user) {
        setUserData(user);
      } else {
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
    width: '100%',
    height: '100%',
  },
});

export default DefaultContent;
