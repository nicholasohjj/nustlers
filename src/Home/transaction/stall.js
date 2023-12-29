import React from 'react';
import { View, Image, StyleSheet } from 'react-native'; // Corrected import
import { Card, Paragraph, Text } from 'react-native-paper'; // Example if you want to use other components from react-native-paper
import Setup from './setup';

const Stall = ({ route }) => {
  const { stall, isQueuing } = route.params;
  const stalls = require("./stalls.json");

  const stallItems = stalls.filter((stall) => stall.stall_id === stall.id)[0];

  return (
    <View style={styles.container}>
      <Card style={styles.header}>
      <Card.Content style={styles.headerContent}>
        {stall.stall_image && (
          <Image
            source={{ uri: stall.stall_image }}
            style={styles.image}
            onError={() => console.log('Error loading canteen image')}
          />
        )}
        <Text variant="headlineSmall" fontWeight={24} >{stall.stall_name}</Text>
      </Card.Content>
      </Card>
      
      {isQueuing ? (
      <Setup stall={stall} />

      ) : (
      <View>
      <Text>Stall Page</Text>
      <Text>{stall.stall_name}</Text>
      <Text>{stall.stall_image}</Text>
      <Text>{stall.stall_id}</Text>
      <Text>{stall.cuisine}</Text>
      </View> 
      )}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginTop:40,
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
