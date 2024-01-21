import React, { useState } from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import { Text, Card, Button } from "react-native-paper";
import StatusIndicator from "./StatusIndicator"; // Import the custom component
import { getTimeAgo } from "./getTimeAgo";
import { addTransaction, deleteTransaction, updateTransaction } from "../../services/transactions";
import { useNavigation } from "@react-navigation/native";
const TransactionDetails = ({ route }) => {
  const navigation = useNavigation();
  const { transaction } = route.params;


  const handleContactBuyer = () => {
    // Logic to contact the buyer
    console.log("Contacting the buyer...");
  };

  const handleReportTransaction = () => {
    // Logic to report the transaction
    console.log("Reporting the transaction...");
  };

  const handleCancelTransaction = async () => {
    await deleteTransaction(transaction.transaction_id);
    navigation.navigate("TransactionsList");
    
  };

  const confirmTransactionPaid = async () => {
    // Logic to confirm the transaction as paid

    const updatedTransaction = {
      ...transaction,
      status: {
        ...transaction.status,
        paid: true,
      },
    };

    try {
      await deleteTransaction(transaction.transaction_id);
      await addTransaction(updatedTransaction);
      console.log("Transaction updated successfully");
      navigation.navigate("TransactionsList");

    }

    catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const confirmTransactionCollected = async () => {
    // Logic to confirm the transaction as collected
    console.log("Confirming the transaction as collected...");

    const updatedTransaction = {
      ...transaction,
      status: {
        ...transaction.status,
        collected: true,
      },
    };

    try {
      await deleteTransaction(transaction.transaction_id);
      await addTransaction(updatedTransaction);
      console.log("Transaction updated successfully");
      navigation.navigate("TransactionsList");

    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const confirmTransactionDelivered = async () => {
    // Logic to confirm the transaction as delivered
    console.log("Confirming the transaction as delivered...");

    const updatedTransaction = {
      ...transaction,
      status: {
        ...transaction.status,
        delivered: true,
      },
    };

    try {
      await deleteTransaction(transaction.transaction_id);
      await addTransaction(updatedTransaction);
      console.log("Transaction updated successfully");
      navigation.navigate("TransactionsList");

    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  }


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
              <Text style={styles.title}>{transaction.stall.stall_name}</Text>
              <View style={styles.statusContainer}>
                <Text style={styles.status}>{statusDisplay()}</Text>
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
            <Text style={styles.detail}>
              Collection Point: {transaction.destination.title}
            </Text>

            <Text style={styles.detail}>
              Last updated: {getTimeAgo(transaction.tm_updated)}
            </Text>

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
            )}

{!transaction.status.paid && (

            <Button
              mode="contained"
              onPress={confirmTransactionPaid}
              style={styles.button}
            >
              Confirm transaction as paid
            </Button>

)}

{transaction.status.paid && !transaction.status.collected && (
            <Button
              mode="contained"
              onPress={confirmTransactionCollected}
              style={styles.button} 
            >
              Confirm transaction as collected
            </Button>
)}

{transaction.status.paid && transaction.status.collected && !transaction.status.delivered && (
            <Button
              mode="contained"
              onPress={confirmTransactionDelivered}
              style={styles.button} 
            >
              Confirm transaction as delivered
            </Button>
)}

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
    alignItems: "center",
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
    flexDirection: "row",
    alignItems: "center",
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
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
});

export default TransactionDetails;
