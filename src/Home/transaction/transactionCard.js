import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, Card, TouchableRipple  } from "react-native-paper";
import StatusIndicator from './StatusIndicator'; // Import the custom component
import { getTimeAgo } from "./getTimeAgo";
const TransactionCard = ({ navigation, transaction, user }) => {

  const isQueuer = transaction.queuer_id === user?.id;

  const handlePress = () => {
    navigation.navigate('TransactionDetails', { transaction });
  };


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
            <Text  variant="titleMedium">{transaction.stall.stall_name}</Text>
              <StatusIndicator status={transaction.status} />
            </View>


            {isQueuer && transaction.status !== "open" && (
              <Text >Buyer: {transaction.buyer_name}</Text>
            )}
            {!isQueuer && <Text>Queuer: {transaction.queuer_name}</Text>}

            <Text>Collection Point: {transaction.destination.title}</Text>
            <Text>Last updated: {getTimeAgo(transaction.tm_updated)}</Text>
          </View>
          <Image
            source={{ uri: transaction.stall.stall_image }}
            style={styles.image}
            resizeMode="cover"
            onError={() => console.log("Error loading image")}
          />
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

export default TransactionCard;
