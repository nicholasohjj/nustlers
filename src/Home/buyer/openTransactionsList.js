import React, { useState, useEffect, useMemo } from "react";
import { ScrollView, View, StyleSheet, Text } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import { supabase } from "../../supabase/supabase";
import OpenTransactionCard from "./openTransactionCard";
import { useNavigation } from "@react-navigation/native";
import { getTransactionsByStallId } from "../../services/transactions";
const OpenTransactionsList = ({stall}) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // For testing
  const [transactions, setTransactions] = useState([]); // For testing
  const navigation = useNavigation();

  const fetchTransactionsByStallId = async (stallId) => {
    try {
      console.log("stallId", stallId);
      const data = await getTransactionsByStallId(stallId);
      setTransactions(data || []); // Set to an empty array if data is null
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      Alert.alert("Error", "Unable to fetch transactions.");
      setTransactions([]); // Set to an empty array in case of error
    }
  };
  

  useEffect(() => {
    fetchTransactionsByStallId(stall.stall_id);
  }, [stall]);

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
      <View>
      <Text style={styles.noTransactionsText}>There's no one queueing!</Text>
      <Text>{JSON.stringify(transactions)}</Text>
      </View>  
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
