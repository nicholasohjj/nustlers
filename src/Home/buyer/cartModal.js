import React, { useMemo, useEffect, useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import {
  Text,
  Portal,
  Modal,
  ToggleButton,
  IconButton,
  Button
} from "react-native-paper";
import {useNavigation} from "@react-navigation/native";

const CartModal = ({
  visible,
  hideModal,
  cartItems,
  transaction,
  addItem,
  removeItem,
}) => {
  const [status, setStatus] = useState('checked');
  const navigation = useNavigation();

  useEffect(() => {
    if (cartItems.length === 0) {
      hideModal();
    }
  }, [cartItems.length, hideModal]);

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

  const subTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.item_price, 0);
  }, [cartItems]);

  const onButtonToggle = value => {
    setStatus(status === 'checked' ? 'unchecked' : 'checked');
  };

  const handleCheckoutPress = () => {
    hideModal();
    navigation.navigate("Checkout", {
      screen: "Confirmation",
      params: {
        transaction: transaction,
        cartItems: cartItems,
        subTotal: subTotal,
      },
    });
};

  return (
    <View>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.containerStyle}
        >
          <IconButton icon="keyboard-backspace" size={20} onPress={hideModal} />
          <Text variant="titleMedium">Cart</Text>
          {uniqueCartItems.map((cartItem) => (
            <View style={styles.item}>
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

              <ToggleButton.Group style={styles.addDelete}>
                <ToggleButton
                  icon="minus"
                  style={styles.toggleButton}
                  onPress={() => {
                    onButtonToggle();
                    removeItem(cartItem)
                  }
                  }              
                  status={status}
                />
                <Text>{cartItem.quantity}</Text>
                {cartItems.length < transaction.max_items && (
                  <ToggleButton
                    icon="plus"
                    style={styles.toggleButton}
                    onPress={() => {
                      onButtonToggle();
                      addItem(cartItem)
                    }
                    }
                    status={status}
                    />
                )}
              </ToggleButton.Group>
            </View>
          ))}
          <Text style={styles.totalAmount}>
            Subtotal: ${subTotal.toFixed(2)}
          </Text>
          <Text style={styles.totalAmount}>
            Service fee: ${transaction.feePerItem.toFixed(2) * cartItems.length}
          </Text>
          <Text style={styles.totalAmount}>
            Total: $
            {(subTotal + transaction.feePerItem * cartItems.length).toFixed(2)}
          </Text>

          <Button 
  mode="contained" 
  onPress={handleCheckoutPress} 
  style={styles.checkoutButton}
>
  Proceed to Checkout
</Button>


        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10,
    flex: 1,
    justifyContent: 'flex-start', // Align content to the start
  },
  itemImage: {
    width: 60, // Reduced for better fit
    height: 60, // Reduced for better fit
    borderRadius: 10,
    marginRight: 15,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f5f5f5", // Light grey background for each item
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    justifyContent: "space-around",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemPrice: {
    fontSize: 14,
    color: "#666", // Darker color for price
  },
  addDelete: {
    flexDirection: "row",
    alignItems: "center",
  },
  toggleButton: {
    marginHorizontal: 5,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "right",
    paddingRight: 20,
  },
  checkoutButton: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: "#6200ee", // Primary color for checkout button
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },
});

export default CartModal;
