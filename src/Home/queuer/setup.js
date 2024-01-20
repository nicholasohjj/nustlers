import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Button, Text, TextInput, Card } from "react-native-paper";
import DestinationModal from "./destinationModal";
import NearbyModal from "./nearbyModal";
import { supabase } from "../../supabase/supabase";
import { useNavigation } from "@react-navigation/native";
import { addTransaction } from "../../services/transactions";
const Setup = ({ stall, coordinate }) => {
  const navigation = useNavigation();
  const [destination, setDestination] = useState();
  const [nearby, setNearby] = useState([]);
  const [nearbyModal, setNearbyModal] = useState(false);
  const [destinationModal, setDestinationModal] = useState(false);
  const [maxItems, setmaxItems] = useState("");
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
    if (!destination) return "";

    const { roomName, roomCode } = destination;
    const isRoomNameIncludesCode = roomName
      .toLowerCase()
      .includes(roomCode.toLowerCase());

    return isRoomNameIncludesCode ? roomName : `${roomCode} ${roomName}`;
  };

  const validateForm = () => {
    if (feePerItem < 0) {
      Alert.alert("Invalid Information", "Please enter a valid fee per item.", [
        { text: "OK" },
      ]);
      return false;
    }

    if (maxItems <= 0) {
      Alert.alert("Invalid Information", "Please enter a valid item count.", [
        { text: "OK" },
      ]);
      return false;
    }

    if (!destination || !feePerItem || !maxItems) {
      Alert.alert(
        "Missing Information",
        "Please fill in all required fields before submitting.",
        [{ text: "OK" }]
      );

      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    // Mark the function as async
    if (validateForm()) {
      setFeePerItem(parseFloat(feePerItem));
      const defaultStatus = {
        paid: false,
        collected: false,
        cancelled: false,
        refunded: false,
        completed: false,
        delivered: false,
      };

      const { coordinate } = destination;

      const stallWithCoordinate = {
        ...stall,
        coordinate,
      };

      const formData = {
        // Declare formData with const
        queuer_id: user.id,
        queuer_name: user.user_metadata.displayName,
        queuer_mobile: user.user_metadata.phone,
        buyer_name: null,
        buyer_mobile: null,
        buyer_id: null,
        stall: stallWithCoordinate,
        destination: {
          title: getTitle(destination),
          coordinate,
        },
        feePerItem,
        max_items: maxItems,
        buyer_id: "",
        buyer_mobile: null,
        items: [],
        total_cost: 0,
        status: defaultStatus,
      };

      console.log(formData);

      try {
        await addTransaction(formData);
        navigation.navigate("Transactions");
        // Further submit logic here...
      } catch (error) {
        console.error("Error submitting form: ", error);
        // Handle the error (e.g., show an alert)
      }
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
        {/* Introductory text */}
        <Text style={styles.text}>
          Let's get started! Tell us what you can carry and where you're headed.
        </Text>

        {/* Item Count */}
        <View style={styles.inline}>
          <Text style={styles.text}>I can carry </Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter number"
            value={maxItems.toString()} // Convert number to string
            onChangeText={(text) =>
              setmaxItems(text === "" ? 0 : parseInt(text))
            }
          />
          <Text style={styles.text}> items.</Text>
        </View>

        {/* Destination Selection */}
        <View style={styles.inline}>
          <Text style={styles.text}>My destination is </Text>
          <Card.Actions>
            <Button style={styles.input} onPress={showDestinationModal}>
              {destination ? getTitle(destination) : "Choose destination"}
            </Button>
          </Card.Actions>
        </View>

        {/* Convenience Fee */}
        <View style={styles.inline}>
          <Text style={styles.text}>Convenience fee per item: $</Text>
          <TextInput
  style={styles.feeInput}
  keyboardType="decimal-pad"
  placeholder="Amount"
  value={feePerItem}
  onChangeText={(text) => {
    // Allow only numbers and up to two decimal places
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(text)) {
      setFeePerItem(text);
    }
  }}
/>
        </View>

        {/* Submit Button */}
        <Button mode="contained" onPress={handleSubmit} style={styles.button}>
          Let's Go!
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
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F4F7FA", // Light background for a clean look
  },
  cardContent: {
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#FFFFFF", // White card background
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // subtle shadow for depth
  },
  inline: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    color: "#333333", // Darker text for better readability
  },
  input: {
    borderWidth: 0,
    backgroundColor: "#E8E8E8", // Light gray background for input
    borderRadius: 8,
    padding: 10,
    minWidth: 50,
    textAlign: "center",
    marginHorizontal: 5,
  },
  feeInput: {
    ...this.input, // Inherits styles from input
    minWidth: 60,
  },
  button: {
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 8,
    width: "80%",
    maxWidth: 400,
    alignSelf: "center",
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  // Add any additional styles you need below
});

export default Setup;
