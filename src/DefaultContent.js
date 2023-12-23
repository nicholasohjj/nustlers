import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Button } from "react-native-elements";
import { supabase } from "./supabase";
import { useNavigation } from "@react-navigation/native";

const DefaultContent = () => {
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
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
      <Text>Home Screen</Text>
      <Text>{JSON.stringify(userData)}</Text>
      <Button
        title="Edit Profile"
        onPress={handleEditProfile}
        containerStyle={styles.button}
      />
      <Button
        title="Logout"
        onPress={handleLogout}
        containerStyle={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButton: {
    marginTop: 20,
  },
});

export default DefaultContent;
