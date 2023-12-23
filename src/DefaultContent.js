import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, } from "react-native";
import { BottomNavigation, Text, Button } from "react-native-paper";
import { supabase } from "./supabase";
import { useNavigation } from "@react-navigation/native";

import Sample from "./content/Sample";

const MusicRoute = ({ userData }) => {
  const navigation = useNavigation(); // Get the navigation object
  const isMobile = Platform.OS === 'web' ? false : true;

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Logout Failed", "An error occurred while logging out.");
    } else {
      navigation.navigate("Welcome");
    }
  };
  const handleEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  return (
    <View style={styles.container}>
      <View style={isMobile ? styles.contentMobile : styles.content}>
        <Text style={styles.title}>{userData ? `Welcome back, ${userData.user_metadata?.displayName}` : "Welcome to Our App!"}</Text>
      </View>

      <Button mode="contained" onPress={handleEditProfile} style={styles.button}>
        Edit Profile
      </Button>
      <Button mode="outlined" onPress={handleLogout} style={styles.button}>
        Logout
      </Button>
    </View>
  );
};

const AlbumsRoute = () => <Text>Albums</Text>;

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
    { key: "albums", title: "Albums", focusedIcon: "album" },
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
      case "albums":
        return <AlbumsRoute jumpTo={jumpTo} />;
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
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  button: {
    marginTop: 20,
    width: "80%", // Example style
    // Add other styling as needed
  },
  logoutButton: {
    marginTop: 20,
  },
});

export default DefaultContent;
