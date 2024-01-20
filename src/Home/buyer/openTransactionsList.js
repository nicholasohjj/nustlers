import React, { useState, useEffect, useMemo } from "react";
import { ScrollView, View, StyleSheet, Text } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import { supabase } from "../../supabase/supabase";
import OpenTransactionCard from "./openTransactionCard";
import { useNavigation } from "@react-navigation/native";
const transactions = require("../../db/transactions.json"); // For testing}
const OpenTransactionsList = ({stall}) => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchUser();
  }, []);

  const filteredTransactions = React.useMemo(() => {
    if (!user) return [];

    return transactions.filter((transaction) =>
        stall.stall_id === transaction.stall.stall_id && !transaction.status.completed &&
            transaction.queuer_id !== user.id && transaction.buyer_id == ""
    );
  }, [user]);
  const renderTransactions = () => {
    return filteredTransactions.length > 0 ? (
      filteredTransactions.map((transaction) => (
        <View key={transaction.id}>
            
          <OpenTransactionCard
            navigation={navigation}
            transaction={transaction}
            user={user}
          />
        </View>
      ))
    ) : (
        
      <Text style={styles.noTransactionsText}>There's no one queueing! {JSON.stringify(stall)}</Text>
    );
  };
  return (
      <ScrollView>{renderTransactions()}</ScrollView>
  );
};

const styles = StyleSheet.create({
  noTransactionsText: {
    textAlign: "center",
    marginTop: 20,
  },
});

export default OpenTransactionsList;
