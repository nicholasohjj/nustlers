import React, { useMemo, useState } from "react";
import { View, Image, StyleSheet, ScrollView } from "react-native";
import { Card, Text, FAB, Badge } from "react-native-paper";
import PropTypes from "prop-types";
import CartModal from "./cartModal";
const ItemCard = ({ item, cartItems, addItem }) => (
  <Card
    key={item.item_id}
    style={styles.card}
    onPress={() => addItem(item)}
  >
    <Card.Content style={styles.cardContent}>
      <Image
        source={{ uri: item.item_image }}
        style={styles.itemImage}
        onError={() => console.log("Error loading image")}
      />
      <View style={styles.item}>
        <Text variant="titleMedium">{item.item_name}</Text>
        <Text>${item.item_price.toFixed(2)}</Text>
      </View>

      {cartItems.filter((cartItem) => cartItem.item_id === item.item_id)
        .length > 0 && (
        <Badge>
          {
            cartItems.filter((cartItem) => cartItem.item_id === item.item_id)
              .length
          }
        </Badge>
      )}
    </Card.Content>
  </Card>
);

ItemCard.propTypes = {
  item: PropTypes.object.isRequired,
};

const StallItems = ({ route }) => {
  const [cartItems, setCartItems] = useState([]); // [item_id, item_id, ...
  const [visible, setVisible] = useState(false); // [item_id, item_id, ...
  const { transaction } = route.params;
  const items = require("../../db/items.json");

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const stall = require("../../db/stalls.json").filter(
    (stall) => stall.stall_id === transaction.stall.stall_id
  )[0];

  const stallItems = useMemo(() => {
    if (stall && Array.isArray(stall.items_ids)) {
      return items.filter((item) => stall.items_ids.includes(item.item_id));
    }
    return [];
  }, [stall, items]);

  const addItem = (item) => {
    if (cartItems.length >= transaction.max_items) {
      return;
    }
    setCartItems([...cartItems, item]);
    console.log(cartItems);
  };

  const removeItem = (item) => {
    setCartItems((currentItems) => {
      const indexToRemove = currentItems.findIndex(
        (cartItem) => cartItem.item_id === item.item_id
      );
      if (indexToRemove > -1) {
        return [
          ...currentItems.slice(0, indexToRemove),
          ...currentItems.slice(indexToRemove + 1),
        ];
      }
      return currentItems;
    });
  }

  const handleCartPress = () => {
    console.log("Cart pressed");
    showModal();
  };

  const handleRemoveItem = (itemId) => {
    setCartItems((currentItems) => {
      const indexToRemove = currentItems.findIndex(
        (item) => item.item_id === itemId
      );
      if (indexToRemove > -1) {
        return [
          ...currentItems.slice(0, indexToRemove),
          ...currentItems.slice(indexToRemove + 1),
        ];
      }
      return currentItems;
    });
  };

  return (
    <View style={styles.container}>
      <Card style={styles.header}>
        <Card.Content style={styles.headerContent}>
          {stall.stall_image && (
            <Image
              source={{ uri: stall.stall_image }}
              style={styles.image}
              onError={() => console.log("Error loading stall image")}
            />
          )}
          <View style={styles.headerText}>
            <Text style={styles.title}>{stall.stall_name}</Text>
            <Text>Pickup point: {transaction.destination.title}</Text>
            <Text>Fee: ${transaction.feePerItem} per item</Text>
            <Text>Max items: {transaction.max_items}</Text>
          </View>
        </Card.Content>
      </Card>

      <ScrollView style={styles.scrollView}>
        {stallItems.length > 0 ? (
          stallItems.map((item) => (
            <ItemCard
              item={item}
              cartItems={cartItems}
              addItem={addItem}
            />
          ))
        ) : (
          <Text>No items found</Text>
        )}
      </ScrollView>
      <CartModal
        visible={visible}
        hideModal={hideModal}
        cartItems={cartItems}
        handleRemoveItem={handleRemoveItem}
        transaction={transaction}
        addItem={addItem}
        removeItem={removeItem}
      />
      {cartItems.length > 0 && (
        <View style={styles.fab}>
          <Text variant="displaySmall"></Text>
          {cartItems.length == transaction.max_items ? (
            <FAB icon="cart" onPress={handleCartPress} />
          ) : (
            <FAB icon="cart-outline" onPress={handleCartPress} />
          )}
        </View>
      )}
    </View>
  );
};

StallItems.propTypes = {
  route: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  image: {
    width: 100, // Adjust as needed
    height: 100, // Adjust as needed
    borderRadius: 20, // Adjust for rounded corners
    marginRight: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    flexShrink: 1, // Ensure the text wraps if too long
  },
  card: {
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  item: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    paddingLeft: 30,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  scrollView: {
    width: "100%",
  },
  fab: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 16,
  },
});

export default StallItems;
