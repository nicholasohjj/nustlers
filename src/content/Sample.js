import React from "react";
import { View, StyleSheet, Alert, } from "react-native";
import { Text, Button } from "react-native-paper";
import { supabase } from "../supabase";
import { useNavigation } from "@react-navigation/native";

const Sample = ({ userData }) => {
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

  export default Sample