import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, StyleSheet, Platform, Alert, Animated } from "react-native";
import { Text, FAB, TextInput } from "react-native-paper";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { getMarkers } from "../../services/markers";

const Map = () => {
  // const [markers, setMarkers] = useState([]);
  // const [loading, setLoading] = useState(false);

  //useEffect(() => {
  //   fetchMarkers();
  //}, []);
  const markers = require("./markers.json");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredMarkers, setFilteredMarkers] = useState(markers); // Assuming markers is your data

  useEffect(() => {
    setFilteredMarkers(
      markers.filter(
        (marker) =>
          marker.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          marker.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, markers]);

  const fetchMarkers = () => {
    setLoading(true);
    getMarkers()
      .then((data) => {
        setMarkers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Error fetching data: " + err.message);
        setLoading(false);
      });
  };

  const pulseAnim = useRef(new Animated.Value(1)).current;

  let MapView, Circle, Marker;
  if (Platform.OS !== "web") {
    MapView = require("react-native-maps").default;
    Circle = require("react-native-maps").Circle;
    Marker = require("react-native-maps").Marker;
  }
  const AnimatedCircle = Animated.createAnimatedComponent(Circle);
  const mapStyle = require("./mapStyle.json");

  const navigation = useNavigation();
  const mapRef = useRef(null);
  const [locationData, setLocationData] = useState({
    region: {
      latitude: 1.2966,
      longitude: 103.7764,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    },
    userLocation: null,
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
    let isMounted = true; // Flag to check if component is mounted

    const animate = () => {
      if (!isMounted) return;

      pulseAnim.setValue(1);
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };

    if (isMobile) {
      fetchLocation();
    }
    animate();

    return () => {
      isMounted = false; // Set the flag to false when component unmounts
    };
  }, [isMobile, pulseAnim]);

  const goToUserLocation = () => {
    if (locationData.userLocation) {
      mapRef.current?.animateToRegion(locationData.userLocation, 1000);
    }
  };

  const handleMarkerPress = (marker) => {
    navigation.navigate("Details", { marker });
  };

  const animatedRadius = pulseAnim.interpolate({
    inputRange: [1, 1.2],
    outputRange: [10, 12], // Example values, adjust as needed
  });

  const animatedFillColor = pulseAnim.interpolate({
    inputRange: [1, 1.2],
    outputRange: ["rgba(135, 206, 250, 0.5)", "rgba(135, 206, 250, 0.7)"],
  });

  const renderMarkers = useMemo(() => {
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
            <AnimatedCircle
              center={locationData.region}
              radius={animatedRadius}
              fillColor={animatedFillColor}
              strokeColor="rgba(0, 0, 255, 1)"
              strokeWidth={2}
            />
          )}
        </MapView>
        <View style={styles.fab}>
          <FAB
            icon="crosshairs-gps"
            style={styles.fab}
            onPress={goToUserLocation}
          />
        </View>
        <TextInput
        flat
          style={styles.searchBar}
          placeholder="Search"
          onChangeText={setSearchQuery}
          value={searchQuery}
          left={<TextInput.Icon icon="map-marker" />}
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
    position: "absolute",
    marginRight: 16,
    right: 0,
    bottom: 80, // Adjust this based on the size of the FAB
  },
  searchBar: {
    position: "absolute",
    width: "90%",
    alignSelf: "center",
    bottom: 40, // Place the search bar above the FAB
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 16,
    zIndex: 1,
  },
});

export default Map;
