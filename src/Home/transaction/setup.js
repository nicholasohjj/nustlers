import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import * as Location from "expo-location";
const { PROVIDER_GOOGLE } = require("react-native-maps");
const MapView = require("react-native-maps").default;
const Circle = require("react-native-maps").Circle;
const Marker = require("react-native-maps").Marker;
const mapStyle = require("../map/mapStyle.json");
import { Modal, Portal, Button, Provider } from "react-native-paper";
const Setup = () => {
  const [itemCount, setItemCount] = useState("");
  const [destination, setDestination] = useState("");
  const [via, setVia] = useState("");
  const [feePerItem, setFeePerItem] = useState("");
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const [region, setRegion] = useState({
    latitude: 1.2966,
    longitude: 103.7764,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  });

  return (
    <View style={styles.container}>
      <View style={styles.inline}>
        <Text style={styles.text}>My hands can carry</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="XX"
          value={itemCount}
          onChangeText={setItemCount}
        />
        <Text style={styles.text}>items.</Text>
      </View>

      <View style={styles.inline}>
        <Text style={styles.text}>I'm heading towards </Text>
        <Button style={styles.input} onPress={showModal}>
          {destination ? destination : "Select a destination"}
        </Button>
      </View>

      <View style={styles.inline}>
        <Text style={styles.text}>passing by </Text>
        <Button style={styles.input} onPress={showModal}>
          {via ? via : "Select nearby locations"}
        </Button>
      </View>

      <View style={styles.inline}>
        <Text style={styles.text}>
          For your convenience, there is a convenience fee of $
        </Text>
        <TextInput
          style={styles.input}
          keyboardType="decimal-pad"
          placeholder="0.00"
          value={feePerItem}
          onChangeText={setFeePerItem}
        />
        <Text style={styles.text}> per item</Text>
      </View>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modal}
        >
                  <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region} // Use region state here
        showsIndoorLevelPicker={true}
        customMapStyle={mapStyle}
        showsMyLocationButton={false}
        loadingEnabled={true}
      ></MapView>
        </Modal>
      </Portal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inline: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginVertical: 5,
  },
  text: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 10,
    padding: 5,
    width: "auto",
    marginHorizontal: 5,
    textAlign: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  modal: {
    backgroundColor: "white",
  },
});

export default Setup;
