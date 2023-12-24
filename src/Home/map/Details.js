// MarkerDetailsScreen.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native'; // Corrected import
import { Card, Paragraph } from 'react-native-paper'; // Example if you want to use other components from react-native-paper

const Details = ({ route }) => {
  const { marker } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{marker.title}</Text>
      <Text>{marker.description}</Text>
      {marker.image && (
        <Image 
          source={{ uri: marker.image }} 
          style={styles.image} 
          resizeMode="contain"
        />
      )}
      {/* You can use other react-native-paper components here if needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: '100%', // Adjust as needed
    height: 200, // Adjust as needed
    marginTop: 10,
  },
  // Add more styles as needed
});

export default Details;
