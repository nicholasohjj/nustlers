import React, { useMemo } from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';
import { Card, Text } from 'react-native-paper';
import PropTypes from 'prop-types';

const StallCard = ({ stall }) => (
  <Card key={stall.stall_id} style={styles.card}>
    <Card.Content style={styles.cardContent}>
      <Image
        source={{ uri: stall.stall_image }}
        style={styles.stallImage}
        onError={() => console.log('Error loading image')}
      />
      <Text style={styles.stallName}>{stall.stall_name}</Text>
    </Card.Content>
  </Card>
);

StallCard.propTypes = {
  stall: PropTypes.object.isRequired,
};

const Canteen = ({ route }) => {
  const { marker } = route.params;
  const canteens = require("./canteens.json");

  const canteenStalls = useMemo(() => 
  canteens.filter((canteen) => canteen.markers_id === marker.id)[0]?.stalls || [], 
    [marker.id, canteens]
  );

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

      <ScrollView style={styles.scrollView}>
        {canteenStalls.length > 0 ? (
          canteenStalls.map((stall) => <StallCard key={stall.stall_id} stall={stall} />)
        ) : (
          <Text>No stalls available</Text>
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

export default Canteen;
