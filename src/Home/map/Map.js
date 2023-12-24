import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Platform, Alert } from "react-native";
import { Text, FAB } from "react-native-paper";
import * as Location from 'expo-location';
import { useNavigation } from "@react-navigation/native";
const mapStyle = require("./mapStyle.json");

const Map = () => {
  let MapView, Circle, Marker;
  if (Platform.OS !== "web") {
    MapView = require("react-native-maps").default;
    Circle = require("react-native-maps").Circle;
    Marker = require("react-native-maps").Marker;
  }
  const navigation = useNavigation();
  const mapRef = useRef(null);
  const [locationData, setLocationData] = useState({
    region: {
      latitude: 1.2966,
      longitude: 103.7764,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    },
    userLocation: null
  });

  const isMobile = Platform.OS === "ios" || Platform.OS === "android";

  const fetchLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Location Permission Denied", "Unable to fetch location.");
      return;
    }
    try {
      let location = await Location.getCurrentPositionAsync({});
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setLocationData({ region: newRegion, userLocation: newRegion });
    } catch (error) {
      Alert.alert("Location Error", "Error fetching location.");
    }
  };

  useEffect(() => {
    if (isMobile) {
      fetchLocation();
    }
  }, [isMobile]);

  const goToUserLocation = () => {
    if (locationData.userLocation) {
      mapRef.current?.animateToRegion(locationData.userLocation, 1000);
    }
  };

  const handleMarkerPress = (marker) => {
    navigation.navigate('Details', { marker });
  };


  const renderMarkers = useMemo(() => {
    const markers = require("./markers.json");
    return markers.map((marker, index) => (
      <Marker
        key={index}
        coordinate={{
          latitude: marker.coordinate.latitude,
          longitude: marker.coordinate.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        title={marker.title}
        description={marker.description}
        onPress={() => handleMarkerPress(marker)}
      />
    ));
  }, []);

  if (Platform.OS === "ios" || Platform.OS === "android") {
    return (
      
      <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={locationData.region}
        showsIndoorLevelPicker={true}
        customMapStyle={mapStyle}
        showsMyLocationButton={false}
        loadingEnabled={true}
      >
        {renderMarkers}
        {Circle && (
          <Circle
            center={locationData.region}
            radius={10}
            fillColor="rgba(135, 206, 250, 0.5)"
            strokeColor="rgba(0, 0, 255, 1)"
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
    );
  } else {
    return (
      <View style={styles.map}>
        <Text>Map is only available on mobile</Text>
      </View>
    );
  }
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
