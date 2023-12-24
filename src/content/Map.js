import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import * as Location from 'expo-location';

let MapView, Circle;
if (Platform.OS !== 'web') {
    MapView = require('react-native-maps').default;
    Circle = require('react-native-maps').Circle;
}

const Map = () => {
    const [currentRegion, setCurrentRegion] = useState({
        latitude: 1.2966,
        longitude: 103.7764,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });
    const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';

    useEffect(() => {
        if (isMobile) {
            (async () => {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    // Handle permission denial
                    return;
                }

                let location = await Location.getCurrentPositionAsync({});
                setCurrentRegion({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                });
            })();
        }
    }, [isMobile]);

    return (
        <View style={styles.container}>
            {isMobile && MapView && (
                <MapView 
                    style={styles.map}
                    region={currentRegion}
                >
                    {Circle && (
                        <Circle
                            center={currentRegion}
                            radius={10} // Radius in meters
                            fillColor="rgba(135, 206, 250, 0.5)" // Light blue with some transparency
                            strokeColor="rgba(0, 0, 255, 1)" // Solid blue border
                            strokeWidth={2}
                        />
                    )}
                </MapView>
            )}
            {(!isMobile || !MapView) && (
                <View style={styles.map}>
                    <Text>Map is only available on mobile</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
});

export default Map;
