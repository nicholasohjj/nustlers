import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, StyleSheet, Alert } from "react-native";
import {
  Text,
  FAB,
  Card,
  Divider,
  TouchableRipple,
  Button,
} from "react-native-paper";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import MapView from "react-native-map-clustering";

const { PROVIDER_GOOGLE } = require("react-native-maps");
const Circle = require("react-native-maps").Circle;
const Marker = require("react-native-maps").Marker;
const mapStyle = require("../map/mapStyle.json");

const VenuesMap = ({currentDestination, setcurrentDestination, toggleVenueSearch}) => {
  const venues = require("./venues.json"); // For testing
  const [userLocation, setUserLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 1.2966,
    longitude: 103.7764,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  });

  const mapRef = useRef(null);

  useEffect(() => {
    fetchLocation();
    subscribeLocationUpdates();
  }, []);

  useEffect(() => {
    if (currentDestination) {
        animateTodestination(currentDestination);
    } else {
      goToUserLocation();
    }
  }, [currentDestination]);

  const subscribeLocationUpdates = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Location Permission Denied", "Unable to fetch location.");
      return;
    }

    Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, distanceInterval: 1 },
      updateLocation
    ).catch((error) => {
      Alert.alert("Location Error", "Error fetching location.");
      console.error("Location subscription error:", error);
    });
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
      setcurrentDestination(null);
      setRegion(userLocation);
      mapRef.current?.animateToRegion(userLocation, 1000);
    }
  };

  const fetchLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Location Permission Denied", "Unable to fetch location.");
      return;
    }
    try {
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 1, // Update every meter.
        },
        updateLocation
      );
      setRegion(userLocation);
      console.log("Current region set", region); // Update only region state
    } catch (error) {
      Alert.alert("Location Error", "Error fetching location.");
    }
  };

  const handledestinationPress = (destination) => {
    setcurrentDestination(destination);
  };

  const getTitle = (destination) => {
    if (destination.roomName.toLowerCase().includes(destination.roomCode.toLowerCase())) {
        return destination.roomName;
    }
    return destination.roomCode + " " + destination.roomName;
    };

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

    mapRef.current?.animateToRegion(destinationLocation, 1000); // 1000 milliseconds for the animation
  };

  const renderdestinations = useMemo(
    () =>
      venues.map((venue, index) => (
        <Marker
          key={index}
          coordinate={venue.coordinate}
          title={getTitle(venue)}
          onPress={() => setcurrentDestination(venue)}
        />
      )),
    [venues, setcurrentDestination]
  );

  const renderCircle = useMemo(() => {
    console.log("Current region", region);
    if (region) {
      return (
        <Circle
          center={region}
          radius={12} // Example static radius value
          fillColor="rgba(135, 206, 250, 1)" // Example static fill color
          strokeColor="rgba(0, 0, 255, 1)"
          strokeWidth={2}
        />
      );
    }
  }, [region]);

  const handleVenueSearch = () => {
    console.log("Test search")
  };

  return (
    <View style={styles.container}>
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
                {currentDestination ? getTitle(currentDestination) : "Current Location"}
              </Text>
            </Card.Content>
          </TouchableRipple>
          {currentDestination ? (
            <View>
                <Divider/>
              <Card.Content style={styles.content}>
                <Card.Actions style={styles.actions}>
                  <Button onPress={() => console.log("test2")}>
                    Select
                  </Button>
                </Card.Actions>
              </Card.Content>
            </View>
          ) : null}
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    padding: 40,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  actions: {
    justifyContent: "space-around",
    alignItems: "center",
  },
});

export default VenuesMap;
