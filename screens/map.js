import { StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import mapStyle from '../mapStyle.json'
import useLipasFetch from '../components/lipasfetch';
import { Marker } from 'react-native-maps';

export default function MapScreen() {

    const [region, setRegion] = useState(null);
    const [places, setPlaces] = useState([]);

    const data = useLipasFetch();

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

            setPlaces(data);
        })();
    }, [data]);

    return (
        <>
            {region && (
                <MapView
                    style={styles.map}
                    region={region}
                    showsUserLocation={true}
                    followUserLocation={true}
                    customMapStyle={mapStyle}
                >
                    {places && places.map((item, index) => (
                        <Marker
                            key={index}
                            coordinate={{
                                latitude: item.location.coordinates.wgs84.lat,
                                longitude: item.location.coordinates.wgs84.lon,
                            }}
                            title={item.name}
                            onPress={e => console.log(e.nativeEvent)}
                        />))}
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