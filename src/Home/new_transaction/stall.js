import React, {useMemo, useEffect, useState} from 'react';
import { View, Image, StyleSheet } from 'react-native'; // Corrected import
import { Card, Text } from 'react-native-paper'; // Example if you want to use other components from react-native-paper
import Setup from '../queuer/setup';
import OpenTransactionsList from '../buyer/openTransactionsList';
import { getStalls } from '../../services/stalls';
const Stall = ({ route }) => {
  const [stalls, setStalls] = useState([]);
  const { id, coordinate, isQueuing } = route.params;

  useEffect(() => {
    fetchStalls();
  }, []);

  
  const fetchStalls = async () => {
    try {
      const data = await getStalls();
      setStalls(data);
    } catch (error) {
      console.error("Error fetching stalls:", error);
      Alert.alert("Error", "Unable to fetch stalls.");
    }
  };


  const currentStall = useMemo(() => {
    console.log("Stalls", stalls);
    return stalls.filter((stall) => stall.stall_id.includes(id))[0] || {};
  }, [id, stalls]);
  

    return (
    <View style={styles.container}>
      <Card style={styles.header}>
        <Card.Content>


          {currentStall && currentStall.stall_image && (
          <View style={styles.headerContent}>
            <Image
              source={{ uri: currentStall.stall_image }}
              style={styles.image}
              onError={() => console.log('Error loading canteen image')}
            />
            <Text
            variant="headlineSmall"
            style={styles.title}
            numberOfLines={2} // Allow text to wrap to a second line
          >
            {currentStall.stall_name}
          </Text>
            
          </View>
          )}

        </Card.Content>
      </Card>
      
      {isQueuing ? (
      <Setup stall={currentStall} />

      ) : (
        <OpenTransactionsList stall={currentStall} coordinate={coordinate} />
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
