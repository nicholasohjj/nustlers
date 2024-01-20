import React, { useState, useEffect } from "react";
import { View, Image, StyleSheet, ScrollView } from "react-native";
import { Card, Text } from "react-native-paper";
import PropTypes from "prop-types";
import { useNavigation } from "@react-navigation/native";
import { getCanteens } from '../../services/canteens';
import { getStalls } from '../../services/stalls';

const StallCard = ({ stall, handleStallPress, marker }) => (
  <Card
    key={stall.stall_id}
    style={styles.card}
    onPress={() => handleStallPress(stall, marker)}
  >
    <Card.Content style={styles.cardContent}>
      <Image
        source={{ uri: stall.stall_image }}
        style={styles.stallImage}
        onError={() => console.log("Error loading image")}
      />
      <View style={styles.stall}>
        <Text variant="titleMedium">{stall.stall_name}</Text>
        <Text variant="bodyLarge">{stall.cuisine}</Text>
      </View>
    </Card.Content>
  </Card>
);

StallCard.propTypes = {
  stall: PropTypes.object.isRequired,
};

const Canteen = ({ route }) => {
  const [canteens, setCanteens] = useState([]);
  const [stalls, setStalls] = useState([]);
  const navigation = useNavigation();
  const { marker, isQueuing } = route.params;

  const fetchStallsById = async (ids) => {
    try {
      console.log("ids", ids);
      const data = await getStallsById(ids);
      if (Array.isArray(data)) {
        setStalls(data);
      } else {
        setStalls([]); // Default to an empty array if response is not an array
      }
    } catch (error) {
      console.error("Error fetching stalls:", error);
      Alert.alert("Error", "Unable to fetch stalls.");
      setStalls([]); // Set to empty array in case of error
    }
  };

  useEffect(() => {
    const fetchCanteens = async () => {
      try {
        const data = await getCanteens();
        setCanteens(data);
      } catch (error) {
        console.error("Error fetching canteens:", error);
        Alert.alert("Error", "Unable to fetch canteens.");
      }
    };

    const fetchStalls = async () => {
      try {
        const data = await getStalls();
        setStalls(data);
      } catch (error) {
        console.error("Error fetching stalls:", error);
        Alert.alert("Error", "Unable to fetch stalls.");
      }
    };

    fetchCanteens();
    fetchStalls();
  }, []);

    
  const handleStallPress = (stall,marker) => {
    const id = stall.stall_id;
    const coordinate = marker.coordinate;
    navigation.navigate("Stall", { id, coordinate, isQueuing });
  };

  return (
    <View style={styles.container}>
      <Card style={styles.header}>

      <Card.Content style={styles.headerContent}>
        {currentCanteen.canteen_image && (
          <Image
            source={{ uri: currentCanteen.canteen_image }}
            style={styles.image}
            onError={() => console.log('Error loading canteen image')}
          />
        )}
        <Text style={styles.title}>{currentCanteen.canteen_name}</Text>
      </Card.Content>
        </Card>

      <ScrollView style={styles.scrollView}>
        {currentCanteenStalls.length > 0 ? (
          currentCanteenStalls.map((stall) => <StallCard  stall={stall} marker={marker} handleStallPress={handleStallPress} />)
        ) : (
          <View>
          <Text>No stalls available</Text>
          <Text>{JSON.stringify(canteens)}</Text>
          <Text>{JSON.stringify(currentCanteen)}</Text>
          <Text>{JSON.stringify(marker.marker_id)}</Text>

          </View>
        )}
      </ScrollView>
    </View>
  );
};

Canteen.propTypes = {
  route: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 100, // Adjust as needed
    height: 100, // Adjust as needed
    borderRadius: 20, // Adjust for rounded corners
    marginRight: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    flexShrink: 1, // Ensure the text wraps if too long
  },
  card: {
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stall: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    paddingLeft: 30,
  },
  stallImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  scrollView: {
    width: "100%",
  },
});

export default Canteen;
