import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import * as Location from "expo-location";
import {
  Modal,
  Portal,
  Button,
  TouchableRipple,
  List,
  Text,
  TextInput,
  Divider,
  IconButton,
  Icon,
} from "react-native-paper";
import VenuesMap from "./venuesMap";
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
  const [currentDestination, setcurrentDestination] = useState();
  const [via, setVia] = useState([]);
  const [mapOpen, setMapOpen] = useState(false);
  const loadMoreItems = () => {
    setDisplayedItemCount((prevCount) => prevCount + 20); // Load 20 more items
  };

  const getTitle = (destination) => {
    if (
      destination.roomName
        .toLowerCase()
        .includes(destination.roomCode.toLowerCase())
    ) {
      return destination.roomName;
    }
    return destination.roomCode + " " + destination.roomName;
  };

  const handleStateChange = (key, value) => {
    setState((prevState) => ({ ...prevState, [key]: value }));
  };

  useEffect(() => {
    (async () => {
      const location = await Location.getCurrentPositionAsync({});
      handleStateChange("currentLocation", location.coords);
    })();
  }, []);

  useEffect(() => {
    if (state.currentLocation) {
      const filtered = venues
        .filter(
          (venue) =>
            venue.roomCode
              .toLowerCase()
              .includes(state.searchQuery.toLowerCase()) ||
            venue.roomName
              .toLowerCase()
              .includes(state.searchQuery.toLowerCase())
        )
        .sort((a, b) => {
          let distanceA = getDistance(state.currentLocation, a.coordinate);
          let distanceB = getDistance(state.currentLocation, b.coordinate);
          return distanceA - distanceB;
        });
      handleStateChange("filteredVenues", filtered);
    }
  }, [state.searchQuery, state.currentLocation, venues]);

  const getDistance = (loc1, loc2) => {
    const dx = loc1.latitude - loc2.latitude;
    const dy = loc1.longitude - loc2.longitude;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleVenuePress = (venue) => {
    console.log(venue);
    handleStateChange("destination", venue);
    console.log(state.destination);
    hideModal();
  };

  const showModal = () => {
    handleStateChange("visible", true);
    setMapOpen(true);
  };

  const hideModal = () => handleStateChange("visible", false);

  const toggleVenueSearch = () => {
    setMapOpen(!mapOpen);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inline}>
        <Text style={styles.text}>My hands can carry</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="XX"
          value={state.itemCount}
          onChangeText={(text) => handleStateChange("itemCount", text)}
        />
        <Text style={styles.text}>items.</Text>
      </View>

      <View style={styles.inline}>
        <Text style={styles.text}>I'm heading towards </Text>
        <Button style={styles.input} onPress={showModal}>
          {state.destination
            ? getTitle(state.destination)
            : "Select a destination"}
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
          onChangeText={(text) => handleStateChange("feePerItem", text)}
        />
        <Text style={styles.text}> per item</Text>
      </View>
      <Button mode="contained" 
                onPress={() => console.log("test")} 
      style={styles.button}>
        Submit
      </Button>

      <Portal>
        <Modal
          visible={state.visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modal}
        >
          {mapOpen ? (
            <VenuesMap
              currentDestination={currentDestination}
              setcurrentDestination={setcurrentDestination}
              toggleVenueSearch={toggleVenueSearch}
            />
          ) : (
            <View style={styles.listContainer}>
              <View style={styles.header}>
                <View style={styles.subheader}>
                  <IconButton
                    icon="arrow-left-drop-circle"
                    size={20}
                    onPress={() => toggleVenueSearch()}
                  />

                  <Text style={styles.title}>Enter Location</Text>
                </View>
                <TextInput
                  mode="outlined"
                  style={styles.textInput}
                  placeholder="Enter location"
                  value={state.searchQuery}
                  onChangeText={(text) =>
                    handleStateChange("searchQuery", text)
                  }
                  left={<TextInput.Icon icon="map-search" />}
                />
              </View>

              <ScrollView style={styles.scrollView}>
                <List.Section>
                  {state.filteredVenues
                    .slice(0, displayedItemCount)
                    .map((venue, index) => (
                      <View key={index}>
                        <TouchableRipple
                          onPress={() => handleVenuePress(venue)}
                        >
                          <List.Item
                            title={getTitle(venue)}
                            left={() => <List.Icon icon="map-marker" />}
                          />
                        </TouchableRipple>
                        <Divider />
                      </View>
                    ))}
                </List.Section>
                {displayedItemCount < state.filteredVenues.length && (
                  <Button onPress={loadMoreItems}>Load More</Button>
                )}
              </ScrollView>
            </View>
          )}
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
  subheader: {
    flexDirection: "row",
  },
  modal: {
    flex: 1,
    backgroundColor: "white",
  },
  listContainer: {
    flex: 1,
    padding: 20,
    width: "100%",
  },

  header: {
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
    paddingTop: 20,
    paddingBottom: 20,
  },
  textInput: {
    width: "100%",
    marginBottom: 20,
    backgroundColor: "white",
  },
  scrollView: {
    width: "100%",
  },
  button: {
    marginTop: 16,
    paddingVertical: 10,
    width: "80%", // Relative width for better appearance on web
    maxWidth: 400, // Maximum width for button
    alignSelf: "center", // Center align the button
  },
});

export default Setup;
