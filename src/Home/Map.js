import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Platform } from "react-native";
import {Text, FAB } from "react-native-paper";
import * as Location from "expo-location";
let MapView, Circle, Marker;
if (Platform.OS !== "web") {
  MapView = require("react-native-maps").default;
  Circle = require("react-native-maps").Circle;
  Marker = require("react-native-maps").Marker;
}

const Map = () => {
  const mapRef = useRef(null);

  const [currentRegion, setCurrentRegion] = useState({
    latitude: 1.2966,
    longitude: 103.7764,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [userLocation, setUserLocation] = useState(null);

  const isMobile = Platform.OS === "ios" || Platform.OS === "android";

  const renderMarkers = () => {
    const markers = require("./markers.json"); // Import the markers here
    return markers.map((marker, index) => {
      const coordinate = {
        latitude: marker.coordinate.latitude,
        longitude: marker.coordinate.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      return (
        <Marker
          key={index}
          coordinate={coordinate}
          title={marker.title}
          description={marker.description}
        />
      );
    });
  };

  useEffect(() => {
    if (isMobile) {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          // Handle permission denial
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const newRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setCurrentRegion(newRegion);
        setUserLocation(newRegion); // Save user location
      })();
    }
  }, [isMobile]);

  const goToUserLocation = () => {
    console.log("User location: ", userLocation);
    if (userLocation) {
      console.log("Updating region to user location");
      setCurrentRegion(userLocation);
    } else {
      console.log("No user location available");
    }
    mapRef.current?.animateToRegion(userLocation, 1000);
  };

  return (
    <View style={styles.container}>
      {isMobile && MapView && (
        <View>
          <MapView
              ref={mapRef}
            style={styles.map}
            region={currentRegion}
            showsIndoorLevelPicker={true}
          >
            {renderMarkers()}
            {Circle && (
              <Circle
                center={currentRegion}
                radius={10} // Radius in meters
                fillColor="rgba(135, 206, 250, 0.5)" // Light blue with some transparency
                strokeColor="rgba(0, 0, 255, 1)" // Solid blue border
                strokeWidth={2}
              />
            )}
          </MapView>
          <FAB
    icon="crosshairs-gps"
    style={styles.fab}
    onPress={goToUserLocation}
  />
          </View>
      )}
      {(!isMobile || !MapView) && (
        <View style={styles.map}>
          <Text>Map is only available on mobile</Text>
        </View>
      )}
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
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default Map;
