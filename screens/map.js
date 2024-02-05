import { StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export default function MapScreen() {

    const [region, setRegion] = useState(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Location permission not granted');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            });
        })();
    }, []);

    return (
        <>
            {region && (
                <MapView
                    style={styles.map}
                    region={region}
                    showsUserLocation={true}
                    followUserLocation={true}
                >
                </MapView>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',

    },
    map: {
        flex: 1,
        width: "100%",
        height: "100%"
    },

    scroll: {
        marginTop: 50,
        flexGrow: 0,
    },
});