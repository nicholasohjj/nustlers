import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ScrollView, View, StyleSheet, Text, RefreshControl } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import { supabase } from "../../supabase/supabase";
import OpenTransactionCard from "./openTransactionCard";
import { useNavigation } from "@react-navigation/native";
import { getTransactionsByStallId } from "../../services/transactions";
const OpenTransactionsList = ({stall}) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  // For testing
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
  

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (user) {
      await fetchTransactionsByStallId(stall.stall_id);
    }
    setRefreshing(false);
  }, [user]);

  const filteredTransactions = React.useMemo(() => {
    if (!user) return [];

    return transactions

    return transactions.filter((transaction) =>
      !transaction.status.completed &&
            transaction.queuer_id !== user.id && !transaction.buyer_id
    );
  }, [user]);
  const renderTransactions = () => {
    if (isLoading) {
      return <Text>Loading...</Text>; // Or any loading indicator you prefer
    }
        return filteredTransactions.length > 0 ? (
      filteredTransactions.map((transaction) => (
        <View key={transaction.transaction_id}>
            
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
      </View>  
    );
  };
  return (
    <ScrollView
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }
  >{renderTransactions()}</ScrollView>
  );
};

const styles = StyleSheet.create({
  noTransactionsText: {
    textAlign: "center",
    marginTop: 20,
  },
});

export default OpenTransactionsList;
