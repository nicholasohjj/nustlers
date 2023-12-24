import React from "react";
import { View, StyleSheet, Alert, Platform } from "react-native";
import { Text } from "react-native-paper";
import { supabase } from "../supabase";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "./UserProvider";
const Sample = () => {
  const navigation = useNavigation(); // Get the navigation object
  const isMobile = Platform.OS === "web" ? false : true;
  const { user } = useUser();

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
        <Text style={styles.title}>
          {user
            ? `Welcome back, ${user.user_metadata?.displayName}`
            : "Welcome to Our App!"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    padding: 20,
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  contentMobile: {
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#000000",
  },
  button: {
    marginTop: 10,
    width: "80%",
    maxWidth: 400,
    alignSelf: "center",
  },
});

export default Sample;
