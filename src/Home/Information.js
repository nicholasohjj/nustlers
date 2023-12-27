import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import { ActivityIndicator, Text, Card, Paragraph, List } from 'react-native-paper';
import { getMarkers, addMarker } from "../services/markers";

const Information = () => {
    const [markers, setMarkers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [newMarker, setNewMarker] = useState({ title: '', description: '', image: '', coordinate: { latitude: 0, longitude: 0 } });

    useEffect(() => {
        fetchMarkers();
    }, []);

    const fetchMarkers = () => {
        setLoading(true);
        getMarkers()
            .then(data => {
                setMarkers(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError("Error fetching data: " + err.message);
                setLoading(false);
            });
    };

    const handleAddMarker = () => {
        addMarker(newMarker)
            .then(() => {
                fetchMarkers();
                setAddModalVisible(false);
            })
            .catch(err => {
                console.error(err);
                setError("Error adding marker: " + err.message);
            });
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator animating={true} size="large" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Information</Text>
            <FlatList
                data={markers}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Card style={styles.card}>
                        <Card.Title title={item.title} />
                        <Card.Content>
                            <Image source={{ uri: item.image }} style={styles.image} />
                            <Paragraph>{item.description}</Paragraph>
                        </Card.Content>
                    </Card>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        width: "100%",
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "left",
        paddingTop: 40,
        paddingBottom: 20,
    },
    card: {
        marginBottom: 10,
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'contain',
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    scrollView: {
        width: "100%",
      },
});

export default Information;
