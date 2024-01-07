import React from 'react';
import { View, Image, StyleSheet } from 'react-native'; // Corrected import
import { Card, Paragraph, Text } from 'react-native-paper'; // Example if you want to use other components from react-native-paper
import Setup from './setup';

const Stall = ({ route }) => {
  const { stall, isQueuing } = route.params;
  const stalls = require("../../db/stalls.json");

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
          <Text
            variant="headlineSmall"
            style={styles.title}
            numberOfLines={2} // Allow text to wrap to a second line
          >
            {stall.stall_name}
          </Text>
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
  image: {
    width: 100, // Adjust as needed
    height: 100, // Adjust as needed
    borderRadius: 20, // Adjust for rounded corners
    marginRight: 20,
  },
  scrollView: {
    width: "100%",
  },
  title: {
    fontSize: 20, // Adjust font size if necessary
    fontWeight: 'bold',
    color: '#333',
    flexShrink: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap', // Allow items within this container to wrap
  },
});

export default Stall;
