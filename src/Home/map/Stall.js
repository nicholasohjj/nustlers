import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native'; // Corrected import
import { Card, Paragraph } from 'react-native-paper'; // Example if you want to use other components from react-native-paper

const Stall = ({ route }) => {
  const { marker } = route.params;
  const stalls = require("./stalls.json");

  const stall = stalls.filter((stall) => stall.stall_id === marker.id)[0];
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {marker.image && (
          <Image
            source={{ uri: marker.image }}
            style={styles.image}
            onError={() => console.log('Error loading canteen image')}
          />
        )}
        <Text style={styles.title}>{marker.title}</Text>
      </View>
      
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding:20,
    marginTop:40,
    marginBottom: 20,
  },
  image: {
    width: 100, // Adjust as needed
    height: 100, // Adjust as needed
    borderRadius: 20, // Adjust for rounded corners
    marginRight: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flexShrink: 1, // Ensure the text wraps if too long
  },
  card: {
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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

export default Stall;
