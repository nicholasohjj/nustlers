import React, { useState, useEffect } from "react";
import { ScrollView, View, StyleSheet, Text } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import { supabase } from "../../supabase/supabase";
import { useUser } from "../../supabase/userProvider";
import TransactionCard from "./transactionCard";
import { useNavigation } from "@react-navigation/native";
const transactions = require("../../db/transactions.json"); // For testing

const TransactionsList = () => {
  const [user, setUser] = useState(null);
  const [value, setValue] = useState("ongoing");
  const navigation = useNavigation();

  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }

    fetchUser();
  }, []);

  const filteredTransactions = transactions.filter((transaction) =>
    value === "ongoing"
      ? transaction.status !== "completed"
      : transaction.status === "completed"
  );

  const renderTransactions = () => {
    return filteredTransactions.length > 0 ? (
      filteredTransactions.map((transaction) => (
        <TransactionCard
          navigation={navigation}
          key={transaction.id}
          transaction={transaction}
          user={user}
        />
      ))
    ) : (
      <Text style={styles.noTransactionsText}>No transactions available.</Text>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transactions</Text>
      <SegmentedButtons
        value={value}
        onValueChange={setValue}
        buttons={[
          { value: "ongoing", label: "Ongoing" },
          { value: "past", label: "Past" },
        ]}
        style={styles.segmentedButtons}
      />
      <ScrollView>{renderTransactions()}</ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width: "100%",
  },
  title: {
    paddingTop: 40,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
    paddingBottom: 20,
  },
  segmentedButtons: {
    marginBottom: 20,
  },
  noTransactionsText: {
    textAlign: "center",
    marginTop: 20,
  },
});

export default TransactionsList;
