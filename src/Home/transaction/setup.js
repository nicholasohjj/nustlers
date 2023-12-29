import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView} from "react-native";
import * as Location from "expo-location";
import { Modal, Portal, Button, TouchableRipple, List, Text, TextInput, Divider } from "react-native-paper";

const Setup = () => {
  const venues = require("./venues.json");

  const [state, setState] = useState({
    itemCount: "",
    destination: "",
    via: "",
    feePerItem: "",
    visible: false,
    currentLocation: null,
    filteredVenues: venues,
    searchQuery: "",
  });
  const [displayedItemCount, setDisplayedItemCount] = useState(20);
  const loadMoreItems = () => {
    setDisplayedItemCount(prevCount => prevCount + 20); // Load 20 more items
  };


  const handleStateChange = (key, value) => {
    setState(prevState => ({ ...prevState, [key]: value }));
  };

   useEffect(() => {
    (async () => {
      const location = await Location.getCurrentPositionAsync({});
      handleStateChange('currentLocation', location.coords);
    })();
  }, []);

  useEffect(() => {
    if (state.currentLocation) {
      const filtered = venues
        .filter((venue) =>
        venue.roomCode.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        venue.roomName.toLowerCase().includes(state.searchQuery.toLowerCase())
        )
        .sort((a, b) => {
          let distanceA = getDistance(state.currentLocation, a.coordinate);
          let distanceB = getDistance(state.currentLocation, b.coordinate);
          return distanceA - distanceB;
        });
        handleStateChange('filteredVenues', filtered);
    }
  }, [state.searchQuery, state.currentLocation, venues]);

  const getDistance = (loc1, loc2) => {
    const dx = loc1.latitude - loc2.latitude;
    const dy = loc1.longitude - loc2.longitude;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleVenuePress = (venue) => {
    console.log(venue);
    handleStateChange('destination', venue);
    console.log(state.destination)
    hideModal();
  };


  const showModal = () => handleStateChange('visible', true);
  const hideModal = () => handleStateChange('visible', false);

  return (
    <View style={styles.container}>
      <View style={styles.inline}>
        <Text style={styles.text}>My hands can carry</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="XX"
          value={state.itemCount}
          onChangeText={(text) => handleStateChange('itemCount', text)}
        />
        <Text style={styles.text}>items.</Text>
      </View>

      <View style={styles.inline}>
        <Text style={styles.text}>I'm heading towards </Text>
        <Button style={styles.input} onPress={showModal}>
          {state.destination ? state.destination.roomName + " " + state.destination.roomCode : "Select a destination"}
        </Button>
      </View>

      <View style={styles.inline}>
        <Text style={styles.text}>passing by </Text>
        <Button style={styles.input} onPress={showModal}>
          {state.via ? state.via : "Select nearby locations"}
        </Button>
      </View>

      <View style={styles.inline}>
  <Text style={styles.text}>
    For your convenience, there is a convenience fee of $
  </Text>
  <TextInput
    style={styles.feeInput}
    keyboardType="decimal-pad"
    placeholder="0.00"
    value={state.feePerItem}
    onChangeText={(text) => handleStateChange('feePerItem', text)}
  />
  <Text style={styles.text}> per item</Text>
</View>

      <Portal>
        <Modal
          visible={state.visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modal}
        >
            <View style={styles.header}>
              <Text style={styles.title}>Enter Location</Text>
              <TextInput
                mode="outlined"
                style={styles.textInput}
                placeholder="Enter location"
                value={state.searchQuery}
                onChangeText={(text) => handleStateChange('searchQuery', text)}
                left={<TextInput.Icon icon="map-search" />}
              />
            </View>

            <ScrollView style={styles.scrollView}>
              <List.Section>                
              {state.filteredVenues
                .slice(0, displayedItemCount)
                .map((venue, index) => (
                  <View key={index}>
                    <TouchableRipple onPress={() => handleVenuePress(venue)}>
                      <List.Item
                        title={venue.roomName + " " + venue.roomCode}
                        left={() => <List.Icon icon="map-marker" />}
                      />
                    </TouchableRipple>
                    <Divider />
                  </View>
                )
                )}
              </List.Section>
              {displayedItemCount < state.filteredVenues.length && (
              <Button onPress={loadMoreItems}>Load More</Button>
            )}
            </ScrollView>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width: "100%",
  },
  inline: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginVertical: 5,
  },
  text: {
    fontSize: 16,
    marginHorizontal: 5, // Adjust as needed for spacing
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
  feeInput: {
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    minWidth: 60, // Set a minimum width for the input
    textAlign: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10, // Optional: adds rounded corners to the modal
  },

  header: {
    margin:20
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
    paddingTop: 20,
    paddingBottom: 20,
  },
  textInput: {
    width: "auto",
  },
  scrollView: {
    width: "100%",
    paddingBottom: 20, // Adds padding at the bottom
  },
});

export default Setup;
