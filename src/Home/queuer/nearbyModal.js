import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import {
  Text,
  FAB,
  Card,
  Divider,
  TouchableRipple,
  Button,
  Portal,
  Modal,
  TextInput,
  List,
  IconButton,
} from "react-native-paper";
import * as Location from "expo-location";
import MapView from "react-native-map-clustering";
import throttle from "lodash.throttle";

const { PROVIDER_GOOGLE } = require("react-native-maps");
const Circle = require("react-native-maps").Circle;
const Marker = require("react-native-maps").Marker;
const mapStyle = require("../../mapStyle.json");
const venues = require("../../db/venues.json"); // For testing



const NearbyModal = ({
  nearby,
  setNearby,
  nearbyModal,
  setNearbyModal,
}) => {
  const defaultRegion = {
    latitude: 1.2966,
    longitude: 103.7764,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  };

  const [selectedNearby, setSelectedNearby] = useState([])
  const [filteredVenues, setFilteredVenues] = useState(venues);
  const [displayedItemCount, setDisplayedItemCount] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const mapRef = useRef(null);

  const getTitle = (venue) => {
    if (venue) {
      return venue.roomName.toLowerCase().includes(venue.roomCode.toLowerCase()) 
        ? venue.roomName 
        : `${venue.roomCode} ${venue.roomName}`;
    }
    return ""; // Return a default value if venue is not defined
  };

  const memoizedVenues = useMemo(() => 
  venues.map(venue => ({
    ...venue,
    title: getTitle(venue)
  })),
[venues]);



useEffect(() => {
  if (venues) {
    const filtered = venues
      .filter(
        (venue) =>
          venue.roomCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          venue.roomName.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map(venue => ({
        ...venue,
        title: getTitle(venue) // Add the title to each venue for sorting
      }))
      .sort((a, b) => a.title.localeCompare(b.title)); // Sort alphabetically by title

    setFilteredVenues(filtered);
  }
}, [searchQuery, venues, setFilteredVenues, getDistance]);



  const loadMoreItems = () => {
    setDisplayedItemCount((prevCount) => prevCount + 20); // Load 20 more items
  };

  const getDistance = (loc1, loc2) => {
    const dx = loc1.latitude - loc2.latitude;
    const dy = loc1.longitude - loc2.longitude;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleVenuePress = (venue) => {
    
  };

  const hideModal = () => {
    setNearbyModal(false);
  };

  const onScroll = (event) => {
    event.persist(); // This removes the event from the pool
    throttledOnScroll(event);
  };

  const actualOnScroll = ({ nativeEvent }) => {
    if (
      nativeEvent &&
      nativeEvent.layoutMeasurement &&
      nativeEvent.contentOffset &&
      nativeEvent.contentSize
    ) {
      const isCloseToBottom =
        nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >=
        nativeEvent.contentSize.height - 50; // 50 is a threshold in pixels
      if (isCloseToBottom) {
        loadMoreItems();
      }
    }
  };

  const throttledOnScroll = throttle(actualOnScroll, 500);

  return (
    <View style={styles.container}>
      <Portal>
        <Modal
          visible={nearbyModal}
          onDismiss={hideModal}
          contentContainerStyle={styles.modal}
        >
            <View style={styles.listContainer}>
              <View style={styles.header}>
                <View style={styles.subheader}>
                  <IconButton
                    icon="arrow-left-drop-circle"
                    size={20}
                    onPress={() => console.log("Back")}
                  />

                  <Text style={styles.title}>Enter Location</Text>
                </View>
                <TextInput
                  mode="outlined"
                  style={styles.textInput}
                  placeholder="Enter location"
                  value={searchQuery}
                  onChangeText={(text) => setSearchQuery(text)}
                  left={<TextInput.Icon icon="map-search" />}
                />
              </View>

              <ScrollView
                style={styles.scrollView}
                onScroll={onScroll}
              >
                <List.Section>
                  {filteredVenues
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
              </ScrollView>
            </View>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modal: {
    flex: 1,
    backgroundColor: "white",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  fab: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  overlay: {
    position: "absolute",
    width: "100%",
    alignSelf: "center",
    bottom: 40, // Place the search bar above the FAB
    paddingHorizontal: 20,
    zIndex: 1,
  },
  searchBar: {
    width: "100%",
    zIndex: 1,
  },
  content: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
    paddingTop: 20,
    paddingBottom: 20,
  },
  actions: {
    justifyContent: "space-around",
    alignItems: "center",
  },
  listContainer: {
    flex: 1,
    padding: 20,
    width: "100%",
  },
  header: {
    paddingTop: 20,
  },
  subheader: {
    flexDirection: "row",
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

export default NearbyModal;
