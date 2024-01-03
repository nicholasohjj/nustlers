import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Button, Text, TextInput, Card } from "react-native-paper";
import DestinationModal from "./destinationModal";
import NearbyModal from "./nearbyModal";
import { useUser } from "../userProvider";
import { supabase } from "../../supabase";

const Setup = ({stall}) => {
  const venues = require("./venues.json");
  const [destination, setDestination] = useState();
  const [nearby, setNearby] = useState([]);
  const [nearbyModal, setNearbyModal] = useState(false);
  const [destinationModal, setDestinationModal] = useState(false);
  const [itemCount, setItemCount] = useState("");
  const [feePerItem, setFeePerItem] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    fetchUser();
  }, []);

  const getTitle = (destination) => {
    if (!destination) return '';
  
    const { roomName, roomCode } = destination;
    const isRoomNameIncludesCode = roomName.toLowerCase().includes(roomCode.toLowerCase());
  
    return isRoomNameIncludesCode ? roomName : `${roomCode} ${roomName}`;
  };
  

  const validateForm = () => {
    if (feePerItem < 0) {
      Alert.alert(
        "Invalid Information",
        "Please enter a valid fee per item.",
        [{ text: "OK" }]
      );
      return false;
    }

    if (itemCount <= 0) {
      Alert.alert(
        "Invalid Information",
        "Please enter a valid item count.",
        [{ text: "OK" }]
      );
      return false;
    }

    if (!destination || !feePerItem || !itemCount) {
      Alert.alert(
        "Missing Information",
        "Please fill in all required fields before submitting.",
        [{ text: "OK" }]
      );

      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    console.log("Form Submitted", destination, feePerItem, itemCount);
    if (validateForm()) {
      console.log("Form Submitted", stall, destination, feePerItem, itemCount, user.id, user.user_metadata.displayName, user.user_metadata.phone);
      // Further submit logic here...
    }
  };

  const showDestinationModal = () => {
    setDestinationModal(true);
  };

  const showNearbyModal = () => {
    setNearbyModal(true);
  };

  return (
    <View style={styles.container}>
      <Card style={styles.cardContent}>
        <View style={styles.inline}>
          <Text style={styles.text}>My hands can carry</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="XX"
            value={itemCount}
            onChangeText={(text) => setItemCount(parseInt(text))}
          />
          <Text style={styles.text}>items.</Text>
        </View>

        <View style={styles.inline}>
          <Text style={styles.text}>I'm heading towards </Text>
          <Card.Actions>
            <Button style={styles.input} onPress={showDestinationModal}>
              {destination ? getTitle(destination) : "Select a destination"}
            </Button>
          </Card.Actions>
        </View>

        <View style={styles.inline}>
          <Text style={styles.text}>
            For your convenience, there is a convenience fee of $
          </Text>
          <TextInput
            style={styles.feeInput}
            keyboardType="decimal-pad"
            placeholder="0.00"
            value={feePerItem}
            onChangeText={(text) => setFeePerItem(parseFloat(text))}
          />
          <Text style={styles.text}> per item</Text>
        </View>
        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
          Submit
        </Button>
      </Card>
      {destinationModal ? (
        <DestinationModal
          destination={destination}
          setDestination={setDestination}
          destinationModal={destinationModal}
          setDestinationModal={setDestinationModal}
        />
      ) : null}

      {nearbyModal ? (
        <NearbyModal
          nearby={nearby}
          setNearby={setNearby}
          nearbyModal={nearbyModal}
          setNearbyModal={setNearbyModal}
          destination={destination}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width: "100%",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inline: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginVertical: 5,
  },
  text: {
    fontSize: 16,
    marginHorizontal: 5, // Adjust as needed for spacing
  },
  input: {
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 10,
    padding: 5,
    width: "auto",
    marginHorizontal: 5,
    textAlign: "center",
  },
  feeInput: {
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    minWidth: 60, // Set a minimum width for the input
    textAlign: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  subheader: {
    flexDirection: "row",
  },
  modal: {
    flex: 1,
    backgroundColor: "white",
  },
  listContainer: {
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
  button: {
    marginTop: 16,
    paddingVertical: 10,
    width: "80%", // Relative width for better appearance on web
    maxWidth: 400, // Maximum width for button
    alignSelf: "center", // Center align the button
  },
});

export default Setup;
