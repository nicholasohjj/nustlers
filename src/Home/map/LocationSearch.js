import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  TextInput,
  List,
  Divider,
  TouchableRipple,
} from "react-native-paper";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
const LocationSearch = () => {
  const navigation = useNavigation();
  const markers = require("./markers.json");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMarkers, setFilteredMarkers] = useState(markers); // Initialize with all markers
  const [navigateToMap, setNavigateToMap] = useState(false); // New state to trigger navigation
  const [selectedMarker, setSelectedMarker] = useState(null); // State to keep track of selected marker

  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
    })();
  }, []);

  useEffect(() => {
    if (currentLocation) {
      const filtered = markers
        .filter((marker) =>
          marker.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
          let distanceA = getDistance(currentLocation, a.coordinate);
          let distanceB = getDistance(currentLocation, b.coordinate);
          return distanceA - distanceB;
        });
      setFilteredMarkers(filtered);
    }
  }, [searchQuery, currentLocation, markers]);

  useEffect(() => {
    if (navigateToMap) {
      // Perform the navigation
      console.log("Selected marker", selectedMarker)
      navigation.navigate("Map", { selectedMarker });
      setNavigateToMap(false); // Reset the state
    }
  }, [navigateToMap, selectedMarker, navigation]);

  const getDistance = (loc1, loc2) => {
    let dx = loc1.latitude - loc2.latitude;
    let dy = loc1.longitude - loc2.longitude;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleCurrentLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});
    setCurrentLocation(location.coords);
    console.log(currentLocation)
    setSelectedMarker(null); // No specific marker selected
    setNavigateToMap(true); // Trigger navigation
  };

  const handleMarkerPress = (marker) => {
    return () => {
      console.log(marker);
      setSelectedMarker(marker); // Set the selected marker
      setNavigateToMap(true); // Trigger navigation
    };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Enter Location</Text>
        <TextInput
          mode="outlined"
          style={styles.textInput}
          placeholder="Enter location"
          value={searchQuery}
          onChangeText={setSearchQuery}
          left={<TextInput.Icon icon="map-search" />}
        />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* List of locations */}
        <List.Section>
          <TouchableRipple onPress={handleCurrentLocation}>
            <List.Item
              title="Current Location"
              left={() => <List.Icon icon="crosshairs-gps" />}
            />
          </TouchableRipple>
          {filteredMarkers.map((marker, index) => (
            <View key={index}>
              <TouchableRipple onPress={handleMarkerPress(marker)}>
                <List.Item
                  title={marker.title}
                  description={marker.description}
                  left={() => <List.Icon icon="map-marker" />}
                />
              </TouchableRipple>
              <Divider />
            </View>
          ))}
        </List.Section>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
});

export default LocationSearch;
