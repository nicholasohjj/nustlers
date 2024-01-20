import React, { useMemo, useState, useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import {
  Text,
  Portal,
  Modal,
  ToggleButton,
  IconButton,
  Button,
  Card,
  Divider,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../../supabase/supabase";

const Confirmation = ({ route }) => {
  const { transaction, cartItems, subTotal } = route.params;
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

  const itemQuantities = useMemo(() => {
    const counts = {};
    cartItems.forEach((item) => {
      counts[item.item_id] = (counts[item.item_id] || 0) + 1;
    });
    return counts;
  }, [cartItems]);

  const uniqueCartItems = useMemo(() => {
    return Object.keys(itemQuantities).map((itemId) => {
      const item = cartItems.find((item) => item.item_id === itemId);
      return { ...item, quantity: itemQuantities[itemId] };
    });
  }, [itemQuantities, cartItems]);

  const handlePlaceOrder = () => {
    const updatedTransaction = {
      ...transaction,
      total_cost: subTotal + transaction.feePerItem * cartItems.length,
      item_ids: cartItems.map((item) => item.item_id),
      buyer_id: user.id,
      buyer_mobile: user.user_metadata.phone,
      buyer_name: user.user_metadata.displayName,
    };
    console.log("Updated transaction", updatedTransaction);
    navigation.navigate("Payment", {
      updatedTransaction: updatedTransaction
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Order Summary</Text>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <Text>Deliver to:</Text>
          <Text variant="titleMedium">{transaction.destination.title}</Text>
        </Card.Content>
        <Divider />
        <View style={styles.info}>
          <Text>Subtotal ({cartItems.length} items):</Text>
          <Text>${subTotal.toFixed(2)}</Text>
        </View>
        <View style={styles.info}>
          <Text>Delivery:</Text>
          <Text>${transaction.feePerItem.toFixed(2) * cartItems.length}</Text>
        </View>
        <View style={styles.info}>
          <Text variant="titleMedium">Order Total:</Text>
          <Text variant="titleMedium">
            ${(subTotal + transaction.feePerItem * cartItems.length).toFixed(2)}
          </Text>
        </View>
      </Card>

      <Card style={styles.card}>
        {uniqueCartItems.map((cartItem) => (
          <View>
            <Card.Content style={styles.itemContent}>
              <Image
                source={{ uri: cartItem.item_image }}
                style={styles.itemImage}
                onError={() => console.log("Error loading image")}
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{cartItem.item_name}</Text>
                <Text style={styles.itemPrice}>
                  ${cartItem.item_price.toFixed(2)}
                </Text>
              </View>
            </Card.Content>
            <Divider />
          </View>
        ))}
        <Card.Content style={styles.content}>
          <Text>Estimated arrival:</Text>
          <Text variant="titleMedium">30 minutes</Text>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={() => handlePlaceOrder()}
        style={styles.placeOrderButton}
        labelStyle={styles.buttonLabel}
      >
        Place your Order
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff", // Setting a white background for overall screen
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    color: "#333", // Dark color for header text
  },
  addressText: {
    fontSize: 18,
    marginBottom: 10,
    color: "#444", // Slightly lighter color for sub-text
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    padding: 10,
    elevation: 3, // Elevation for Android shadow
  },
  itemDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  itemPrice: {
    fontSize: 16,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "right",
    paddingRight: 20,
    color: "#6200ee", // Using primary color for total amount
  },
  subtotalText: {
    textAlign: "right",
    paddingRight: 20,
    fontSize: 16,
    color: "#666",
  },
  deliveryDetails: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#eef6ff", // Light blue background for delivery details
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deliveryText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  placeOrderButton: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: "#6200ee", // Primary color for button
    borderRadius: 8,
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 18,
  },
  card: {
    width: "100%",
    zIndex: 1,
    marginTop: 20,
  },
  content: {
    padding: 10,
  },
  info: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
});

export default Confirmation;
