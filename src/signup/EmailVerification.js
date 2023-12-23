import React, { useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

const EmailVerification = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // Redirect to the welcome screen after 5 seconds
    const timer = setTimeout(() => {
      navigation.navigate("Welcome");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.centeredContainer}>
      <Text style={styles.verificationText}>
        Please check your email to verify your account.
      </Text>
      <Button title="Go to Welcome" onPress={() => navigation.navigate("Welcome")} />
    </View>
  );
};

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  verificationText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  // Add more styles if needed
});

export default EmailVerification;
