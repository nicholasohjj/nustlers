import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import { ActivityIndicator, Text, Card, Paragraph, Button, TextInput, Modal } from 'react-native-paper';
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
            <Button onPress={() => setAddModalVisible(true)}>
                Add Marker
            </Button>
            <FlatList
                data={markers}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Card style={styles.card}>
                        <Card.Title title={item.title} />
                        <Card.Content>
                            <Image source={{ uri: item.image }} style={styles.image} />
                            <Paragraph>{JSON.stringify(item.coordinate)}</Paragraph>
                            <Paragraph>{item.description}</Paragraph>
                        </Card.Content>
                    </Card>
                )}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={addModalVisible}
                onRequestClose={() => {
                    setAddModalVisible(!addModalVisible);
                }}
            >
                <View style={styles.modalView}>
                    <TextInput placeholder="Title" onChangeText={(text) => setNewMarker({ ...newMarker, title: text })} />
                    <TextInput placeholder="Description" onChangeText={(text) => setNewMarker({ ...newMarker, description: text })} />
                    <TextInput placeholder="Image URL" onChangeText={(text) => setNewMarker({ ...newMarker, image: text })} />
                    <Button onPress={handleAddMarker}>
                        Add Marker
                    </Button>
                    <Button onPress={() => setAddModalVisible(false)} >
                        Close
                    </Button>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 10,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
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
});

export default Information;
