import React from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import StatusIndicator from './StatusIndicator'; // Import the custom component
import { getTimeAgo } from "./getTimeAgo";
const TransactionDetails = ({ route }) => {
  const { transaction } = route.params;

  const handleContactBuyer = () => {
    // Logic to contact the buyer
    console.log("Contacting the buyer...");
  };

  const handleReportTransaction = () => {
    // Logic to report the transaction
    console.log("Reporting the transaction...");
  };

  const handleCancelTransaction = () => {
    // Logic to cancel the transaction
    console.log("Cancelling the transaction...");
  };
  
  const statusDisplay = () => {
    const status = transaction.status;
  
    if (status.cancelled) {
      return "Cancelled";
    } else if (status.collected) {
      return "Collected";
    } else if (status.completed) {
      return "Completed";
    } else if (status.delivered) {
      return "Delivered";
    } else if (status.paid) {
      return "Paid";
    } else if (status.refunded) {
      return "Refunded";
    } else {
      return "Open";
    }
  };
  


  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.contentDetails}>
            <View style={styles.header}>
              <Text style={styles.title}>
              {transaction.stall.stall_name}
              </Text>
              <View style={styles.statusContainer}>
              <Text style={styles.status}>
                {statusDisplay()}
              </Text>
              <StatusIndicator status={transaction.status} />
            </View>
              </View>

            <Image
              source={{ uri: transaction.stall.stall_image }}
              style={styles.image}
              resizeMode="cover"
            />

            <Text style={styles.detail}>Buyer: {transaction.buyer_name}</Text>
            <Text style={styles.detail}>Queuer: {transaction.queuer_name}</Text>
            <Text style={styles.detail}>Collection Point: {transaction.destination.title}</Text>

            <Text style={styles.detail}>Last updated: {getTimeAgo(transaction.tm_updated)}</Text>

            {transaction.buyer_name ? (
                          <Button
                          mode="contained"
                          onPress={handleContactBuyer}
                          style={styles.button}
                        >
                          Contact Buyer
                        </Button>
            ) : (
              <Button
              mode="contained"
              onPress={handleCancelTransaction}
              style={styles.button}
            >
              Cancel transaction
            </Button>
            )
              }


            <Button
              mode="outlined"
              onPress={handleReportTransaction}
              style={styles.button}
            >
              Report
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    marginBottom: 20,
  },
  card: {
    margin: 10,
  },
  contentDetails: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  status: {
    fontSize: 16,
    marginRight: 5,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  detail: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
});

export default TransactionDetails;
