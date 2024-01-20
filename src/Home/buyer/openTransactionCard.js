import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, Card, TouchableRipple  } from "react-native-paper";
import StatusIndicator from '../transaction/StatusIndicator'; // Import the custom component
import { getTimeAgo } from "../transaction/getTimeAgo";

const OpenTransactionCard = ({ navigation, transaction }) => {


  const handlePress = () => {
    console.log(transaction)
    navigation.navigate("StallItems", { transaction });
  };
  const formattedFee = parseFloat(transaction.feePerItem).toFixed(2);


  return (
    <View style={styles.container}>
          <TouchableRipple
    onPress={handlePress}
    rippleColor="rgba(0, 0, 0, .32)"
  >
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.contentDetails}>
          <View style={styles.header}>
            <Text  variant="titleLarge">{transaction.destination.title}</Text>
              <StatusIndicator status={transaction.status} />
            </View>
            <Text>Queuer: {transaction.queuer_name}</Text>
            <Text>Maximum items: {transaction.max_items - transaction.items_ids.length}</Text>
            <Text>Fee: ${formattedFee} per item</Text>
            <Text>Last updated: {getTimeAgo(transaction.tm_updated)}</Text>
          </View>
        </Card.Content>
      </Card>
      </TouchableRipple>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "95%",
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    paddingTop: 40,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
    paddingBottom: 20,
  },
  image: {
    flex: 1, // Take up half the space
    width: "100%", // Fill the entire flex container width
    height: "100%", // Fill the entire flex container height
    borderRadius: 0, // Remove rounded corners if you want edge to edge
  },

  scrollView: {
    width: "100%",
  },
  contentDetails: {
    flex: 1,
    padding: 10,
  },
  cardContent: {
    flexDirection: "row", // Arrange children side by side
    margin: 0, // Ensure no extra margin
    padding: 0, // Ensure no extra padding
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    marginBottom: 20,
  }
});

export default OpenTransactionCard;
