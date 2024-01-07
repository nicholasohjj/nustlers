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



const DestinationModal = ({
  destination,
  setDestination,
  destinationModal,
  setDestinationModal,
}) => {
  const defaultRegion = {
    latitude: 1.2966,
    longitude: 103.7764,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  };
  const [selectedDestination, setSelectedDestination] = useState(
    destination ? destination : null
  );
  const [userLocation, setUserLocation] = useState(null);
  const [region, setRegion] = useState(defaultRegion);
  const [filteredVenues, setFilteredVenues] = useState(venues);
  const [displayedItemCount, setDisplayedItemCount] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [mapOpen, setMapOpen] = useState(true);
  const mapRef = useRef(null);

  useEffect(() => {
    fetchLocation();
    subscribeLocationUpdates();

    if (destination) {
      animateTodestination(destination);
    } else {
      goToUserLocation();
    }
  }, [
    destination,
    goToUserLocation,
    animateTodestination,
    fetchLocation,
    subscribeLocationUpdates,
  ]);

  useEffect(() => {
    if (userLocation && searchQuery && venues && !mapOpen) {
      const filtered = venues
        .filter(
          (venue) =>
            venue.roomCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            venue.roomName.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
          let distanceA = getDistance(userLocation, a.coordinate);
          let distanceB = getDistance(userLocation, b.coordinate);
          return distanceA - distanceB;
        });
      setFilteredVenues(filtered);
    }
  }, [searchQuery, userLocation, venues, setFilteredVenues, getDistance]);

  const toggleVenueSearch = () => {
    setMapOpen(!mapOpen);
  };

  const loadMoreItems = () => {
    setDisplayedItemCount((prevCount) => prevCount + 20); // Load 20 more items
  };

  const getDistance = (loc1, loc2) => {
    const dx = loc1.latitude - loc2.latitude;
    const dy = loc1.longitude - loc2.longitude;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleVenuePress = (venue) => {
    setSelectedDestination(venue);
    toggleVenueSearch();
    animateTodestination(venue);
  };

  const subscribeLocationUpdates = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Location Permission Denied", "Unable to fetch location.");
      return;
    }

    try {
      await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 1 },
        updateLocation
      );
    } catch (error) {
      Alert.alert("Location Error", "Error fetching location.");
      console.error("Location subscription error:", error);
    }
  };

  const updateLocation = (location) => {
    const newUserLocation = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.001,
      longitudeDelta: 0.001,
    };
    setUserLocation(newUserLocation); // Update only userLocation state
  };

  const goToUserLocation = () => {
    console.log("My location", userLocation);
    if (userLocation) {
      setSelectedDestination(null);
      setRegion(userLocation);
      mapRef.current?.animateToRegion(userLocation, 1000);
    }
  };

  const handleSelectPress = () => {
    setDestination(selectedDestination);
    hideModal();
  };

  const hideModal = () => {
    setDestinationModal(false);
  };

  const fetchLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Location Permission Denied", "Unable to fetch location.");
      return;
    }
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      updateLocation(location); // Update location using the existing updateLocation function
    } catch (error) {
      Alert.alert("Location Error", "Error fetching location.");
      console.error("Location fetch error:", error);
    }
  };

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


  const animateTodestination = (destination) => {
    console.log("Animate to destination", destination);
    if (!destination) {
      goToUserLocation();
      return;
    }

    const destinationLocation = {
      latitude: destination.coordinate.latitude,
      longitude: destination.coordinate.longitude,
      latitudeDelta: 0.001, // Adjust these delta values as needed for zoom level
      longitudeDelta: 0.001,
    };
    setRegion(destinationLocation); // Update only region state
    mapRef.current?.animateToRegion(destinationLocation, 1000); // 1000 milliseconds for the animation
  };

  const renderdestinations = useMemo(
    () =>
      memoizedVenues.map((venue, index) => (
        <Marker
          key={index}
          coordinate={venue.coordinate}
          title={venue.title}
          pinColor={selectedDestination && venue.roomName === selectedDestination.roomName ? "blue" : "red"}
          onPress={() => setSelectedDestination(venue)}
        />
      )),
    [memoizedVenues, selectedDestination, setSelectedDestination]
  );
  
  

  const renderCircle = useMemo(() => {
    console.log("Current region", region);
    if (region) {
      return (
        <Circle
          center={userLocation ? userLocation : region}
          radius={12} // Example static radius value
          fillColor="rgba(135, 206, 250, 1)" // Example static fill color
          strokeColor="rgba(0, 0, 255, 1)"
          strokeWidth={2}
        />
      );
    }
  }, [region]);

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
          visible={destinationModal}
          onDismiss={hideModal}
          contentContainerStyle={styles.modal}
        >
          {mapOpen ? (
            <View>
              <MapView
                provider={PROVIDER_GOOGLE}
                ref={mapRef}
                style={styles.map}
                region={region} // Use region state here
                showsIndoorLevelPicker={true}
                customMapStyle={mapStyle}
                showsMyLocationButton={false}
                loadingEnabled={true}
              >
                {renderdestinations}
                {renderCircle}
              </MapView>
              <View style={styles.overlay}>
                <View style={styles.fab}>
                  <Text variant="displaySmall"></Text>
                  <FAB icon="crosshairs-gps" onPress={goToUserLocation} />
                </View>

                <Card style={styles.searchBar}>
                  <TouchableRipple onPress={toggleVenueSearch}>
                    <Card.Content style={styles.content}>
                      <Text>Destination</Text>
                      <Text variant="titleMedium">
                        {selectedDestination
                          ? getTitle(selectedDestination)
                          : "Current Location"}
                      </Text>
                    </Card.Content>
                  </TouchableRipple>
                  {selectedDestination ? (
                    <View>
                      <Divider />
                      <Card.Content style={styles.content}>
                        <Card.Actions style={styles.actions}>
                          <Button onPress={() => handleSelectPress()}>
                            Select
                          </Button>
                        </Card.Actions>
                      </Card.Content>
                    </View>
                  ) : null}
                </Card>
              </View>
            </View>
          ) : (
            <View style={styles.listContainer}>
              <View style={styles.header}>
                <View style={styles.subheader}>
                  <IconButton
                    icon="arrow-left-drop-circle"
                    size={20}
                    onPress={toggleVenueSearch}
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
                onScroll={throttledOnScroll}
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
          )}
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

export default DestinationModal;
