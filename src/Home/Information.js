import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { ActivityIndicator, Text, Card, Paragraph } from 'react-native-paper';
import { getMarkers } from "../services/markers";

const Information = () => {
    const [markers, setMarkers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        getMarkers()
            .then(data => {
                setMarkers(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError(err);
                setLoading(false);
            });
    }, []);

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
                <Text>Error fetching data.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Information</Text>
            <Text style={styles.header}>{JSON.stringify(markers)}</Text>

            <FlatList
                data={markers}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Card style={styles.card}>
                        <Card.Title title={item} />
                        <Card.Content>
                            <Paragraph>{item}</Paragraph>
                            {/* Include other details as needed */}
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
});

export default Information;
