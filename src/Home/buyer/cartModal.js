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
import { useNavigation } from "@react-navigation/native";

const CartItem = React.memo(({ item, onAdd, onRemove, isMaxItemsReached }) => (
  <View style={styles.item}>
    <Image
      source={{ uri: item.item_image }}
      style={styles.itemImage}
      onError={() => console.log("Error loading image")}
    />
    <View style={styles.itemDetails}>
      <Text style={styles.itemName}>{item.item_name}</Text>
      <Text style={styles.itemPrice}>${item.item_price.toFixed(2)}</Text>
    </View>

    <ToggleButton.Group style={styles.addDelete}>
      <ToggleButton
        icon="minus"
        style={styles.toggleButton}
        onPress={() => onRemove(item)}
        status="unchecked"
      />
      <Text>{item.quantity}</Text>
      {!isMaxItemsReached && (
        <ToggleButton
          icon="plus"
          style={styles.toggleButton}
          onPress={() => onAdd(item)}
          status="unchecked"
        />
      )}
    </ToggleButton.Group>
  </View>
));

const CartModal = ({
  visible,
  hideModal,
  cartItems,
  transaction,
  addItem,
  removeItem,
}) => {
  const navigation = useNavigation();
  const isMaxItemsReached = cartItems.length >= transaction.max_items;

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

  const handleCheckoutPress = () => {
    hideModal();
    navigation.reset({
      index: 0,
      routes: [{ name: 'SearchMap' }],
    });
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
          {uniqueCartItems.length > 0 ? (
            uniqueCartItems.map((cartItem) => (
              <CartItem
                key={cartItem.item_id}
                item={cartItem}
                onAdd={addItem}
                onRemove={removeItem}
                isMaxItemsReached={isMaxItemsReached}
              />
            ))
          ) : (
            <Text>Your cart is empty.</Text>
          )}
          <Text style={styles.totalAmount}>
            Subtotal: ${subTotal.toFixed(2)}
          </Text>
          <Text style={styles.totalAmount}>
            Delivery: ${transaction.feePerItem.toFixed(2) * cartItems.length}
          </Text>
          <Text style={styles.totalAmount}>
            Total: $
            {(subTotal + transaction.feePerItem * cartItems.length).toFixed(2)}
          </Text>

          <Button
            mode="contained"
            onPress={handleCheckoutPress}
            style={styles.checkoutButton}
            disabled={cartItems.length === 0}
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
    justifyContent: 'flex-start',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
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
    color: "#666",
  },
  addDelete: {
    flexDirection: "row",
    alignItems: "center",
  },
  toggleButton: {
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
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
    backgroundColor: "#6200ee",
    borderRadius: 8,
    shadowColor: "#6200ee",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },
});


export default CartModal;
