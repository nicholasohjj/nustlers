import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
  },
});

const Welcome = () => {
  return (
    <View style={styles.container}>
        <Text>Welcome Text</Text>   
    </View>

    );
}

export default Welcome
