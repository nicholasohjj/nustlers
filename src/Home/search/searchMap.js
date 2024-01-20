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
const mapStyle = require("../../mapStyle.json");
const markers = require("../../db/markers.json");

const Map = ({ route }) => {
  const navigation = useNavigation();
  const [currentMarker, setCurrentMarker] = useState(
    route.params?.selectedLocation
  );

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
    if (route.params?.selectedLocation) {
      setCurrentMarker(route.params.selectedLocation);
    } else {
      goToUserLocation();
    }
  }, [route.params?.selectedLocation]);

  useEffect(() => {
    if (route.params?.selectedLocation) {
      animateToMarker(currentMarker);
    }
  }, [currentMarker]);

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
    });6
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
      setCurrentMarker(null);
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

  const handleMarkerPress = (marker) => {
    setCurrentMarker(marker);
  };

  const animateToMarker = (marker) => {
    console.log("Animate to marker", marker);
    if (!marker) {
      goToUserLocation();
      return;
    }

    const markerLocation = {
      latitude: marker.coordinate.latitude,
      longitude: marker.coordinate.longitude,
      latitudeDelta: 0.001, // Adjust these delta values as needed for zoom level
      longitudeDelta: 0.001,
    };

    mapRef.current?.animateToRegion(markerLocation, 1000); // 1000 milliseconds for the animation
  };

  const renderMarkers = useMemo(
    () =>
      markers.map((marker, index) => (
        <Marker
          key={index}
          coordinate={marker.coordinate}
          title={marker.marker_title}
          onPress={() => handleMarkerPress(marker)}
        />
      )),
    [markers, currentMarker]
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

  const handleLocationSearch = () => {
    navigation.navigate("SearchList");
  };

  const handleQueueButton = (marker) => {
    if (marker.stall_count == 0) {
      //Consider the restaurant as a stall and convert it to a stall page
      const id = marker.marker_id;
      const coordinate = marker.coordinate;
      navigation.navigate("Stall", {
        id,
        coordinate,
        isQueuing: true,
      });
    } else {
      navigation.navigate("Canteen", {
        marker,
        isQueuing: true,
      });
      console.log("Queue button pressed for canteen", marker.marker_title);
    }
  };

  const handleOrderButton = (marker) => {
    if (marker.stall_count == 0) {
      const id = marker.marker_id;
      const coordinate = marker.coordinate;
      console.log("Order button pressed for stall", id)
      navigation.navigate("Stall", {
        id,
        coordinate,
        isQueuing: false,
      });
    } else {
      navigation.navigate("Canteen", {
        marker,
        isQueuing: false,
      });
    }
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
        {renderMarkers}
        {renderCircle}
      </MapView>
      <View style={styles.overlay}>
        <View style={styles.fab}>
          <Text variant="displaySmall"></Text>
          <FAB icon="crosshairs-gps" onPress={goToUserLocation} />
        </View>

        <Card style={styles.searchBar}>
          <TouchableRipple onPress={handleLocationSearch}>
            <Card.Content style={styles.content}>
              <Text>Location</Text>
              <Text variant="titleMedium">
                {currentMarker ? currentMarker.marker_title : "Current Location"}
              </Text>
            </Card.Content>
          </TouchableRipple>
          {currentMarker ? (
            <View>
              <Divider />

              <Card.Content style={styles.content}>
                <Text>Operating Hours</Text>
                {currentMarker.operating_hours.vacation ==
                currentMarker.operating_hours.term ? (
                  <Text variant="titleMedium">
                    Term Time and Vacation: {currentMarker.operating_hours.term}
                  </Text>
                ) : (
                  <View>
                    <Text variant="titleMedium">
                      Term Time: {currentMarker.operating_hours.term}
                    </Text>
                    <Text variant="titleMedium">
                      Vacation: {currentMarker.operating_hours.vacation}
                    </Text>
                  </View>
                )}
              </Card.Content>
              <Divider />
              <Card.Content style={styles.content}>
                <Card.Actions style={styles.actions}>
                  <Button onPress={() => handleQueueButton(currentMarker)}>
                    I'm queuing!
                  </Button>
                  <Button onPress={() => handleOrderButton(currentMarker)}>
                    I'm hungry...
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
    justifyContent: "flex-end",
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
  marker_title: {
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

export default Map;
