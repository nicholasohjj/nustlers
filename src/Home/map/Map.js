import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, StyleSheet, Platform, Alert, Animated } from "react-native";
import {
  Text,
  FAB,
  Card,
  Avatar,
  Divider,
  TouchableRipple,
} from "react-native-paper";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { getMarkers } from "../../services/markers";

const Map = ({ route }) => {
  const navigation = useNavigation();
  const [currentMarker, setCurrentMarker] = useState(route.params?.selectedMarker);
  const mapRef = useRef(null);

  const goToUserLocation = () => {
    if (userLocation) {
      setCurrentMarker(null)
      setRegion(userLocation); // Update region with user's current location
      mapRef.current?.animateToRegion(userLocation, 1000);
    }
  };
  

  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
     fetchMarkers();
  }, []);

  useEffect(() => {
    if (route.params?.selectedMarker) {
      setCurrentMarker(route.params.selectedMarker);
    } else {
      goToUserLocation();
    }
  }, [route.params?.selectedMarker]);
  


  useEffect(() => {
    if (currentMarker) {
      console.log("Marker loaded", currentMarker.title);
      const markerLocation = {
        latitude: currentMarker.coordinate.latitude,
        longitude: currentMarker.coordinate.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      };
      mapRef.current?.animateToRegion(markerLocation, 1000);
    } else {
      goToUserLocation();
    }
  }, [currentMarker]);

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

  const [userLocation, setUserLocation] = useState(null); // Separate state for user's current location
  const [region, setRegion] = useState({
    latitude: 1.2966,
    longitude: 103.7764,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  });

  const isMobile = Platform.OS === "ios" || Platform.OS === "android";

  const updateLocation = (location) => {
    const newUserLocation = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.001,
      longitudeDelta: 0.001,
    };
    setUserLocation(newUserLocation); // Update only userLocation state
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
  const LeftContent = (props) => <Avatar.Icon {...props} icon="folder" />;

  const renderMarkers = useMemo(() => {
    return markers.map((marker, index) => (
      <Marker
        key={index}
        pinColor={currentMarker && currentMarker.title === marker.title ? "blue" : "red"}
        coordinate={marker.coordinate}
        title={marker.title}
        description={marker.description}
        onPress={() => handleMarkerPress(marker)}
      />
    ));
  }, [currentMarker]); // Include currentMarker in dependency array
  

  const handleLocationSearch = () => {
    navigation.navigate("LocationSearch");
  };

  if (Platform.OS === "ios" || Platform.OS === "android") {
    return (
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region} // Use region state here
          showsIndoorLevelPicker={true}
          customMapStyle={mapStyle}
          showsMyLocationButton={false}
          loadingEnabled={true}
        >
          {renderMarkers}
          {Circle && (
            <AnimatedCircle
              center={region}
              radius={animatedRadius}
              fillColor={animatedFillColor}
              strokeColor="rgba(0, 0, 255, 1)"
              strokeWidth={2}
            />
          )}
        </MapView>
        <View style={styles.overlay}>
          <View style={styles.fab}>
            <Text variant="displaySmall">Title Here</Text>
            <FAB icon="crosshairs-gps" onPress={goToUserLocation} />
          </View>

          <Card style={styles.searchBar}>
            <TouchableRipple onPress={handleLocationSearch}>
              <Card.Content style={styles.content}>
                <Text>Location</Text>
                <Text variant="titleMedium">
              {currentMarker ? currentMarker.title : "Current Location"}
            </Text>
              </Card.Content>
            </TouchableRipple>
            <Divider />
            <Card.Content style={styles.content}>
              <Text>Location</Text>
              {currentMarker ? (
                <Text variant="titleMedium">{currentMarker.title}</Text>
              ) : (
                <Text variant="titleMedium">Current Location</Text>
              )}
            </Card.Content>
          </Card>
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.map}>
        <Text style={styles.title}>Map is only available on mobile</Text>
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
});

export default Map;
