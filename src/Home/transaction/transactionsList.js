import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  RefreshControl,
  Alert,
} from "react-native";
import { SegmentedButtons, Text } from "react-native-paper";
import { supabase } from "../../supabase/supabase";
import TransactionCard from "./transactionCard";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { getTransactionsById } from "../../services/transactions";

const TransactionsList = () => {
  const [transactions, setTransactions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const [value, setValue] = useState("ongoing");
  const navigation = useNavigation();

  const fetchUser = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      setUser(data.user);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  const fetchTransactions = useCallback(async () => {
    if (user) {
      try {
        const data = await getTransactionsById(user.id);
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        Alert.alert("Error", "Unable to fetch transactions.");
      }
    }
  }, [user]);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    const init = async () => {
      await fetchUser();
      await fetchTransactions();
    };
  
    init();
  }, [fetchTransactions]);
  

  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        await fetchTransactions();
      };
  
      init();
    }, [fetchTransactions])
  );
  
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  }, [fetchTransactions]);

  const filteredTransactions = React.useMemo(() => {
    if (!user) return [];

    return transactions.filter((transaction) =>
      value == "ongoing"
        ? !transaction.status.completed &&
          (transaction.buyer_id === user.id ||
            transaction.queuer_id === user.id)
        : // Implement different logic for past transactions here
          transaction.status.completed &&
          (transaction.buyer_id === user.id ||
            transaction.queuer_id === user.id)
    );
  }, [user, value]);

  const renderTransactions = () => {
    return filteredTransactions.length > 0 ? (
      filteredTransactions.map((transaction) => (
        <View key={transaction.id}>
          <TransactionCard
            navigation={navigation}
            transaction={transaction}
            user={user}
          />
        </View>
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
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderTransactions()}
      </ScrollView>
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
