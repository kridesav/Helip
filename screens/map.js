import {
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    StatusBar
} from 'react-native';
import MapView  from 'react-native-maps';
import React, { useState, useEffect, PROVIDER_GOOGLE } from 'react';
import * as Location from 'expo-location';
import LoadingIndicator from '../components/Loading'
import mapStyle from '../mapStyle.json'
import useLipasFetch from '../components/lipasfetch';
import { Marker } from 'react-native-maps';



export default function MapScreen() {

    const [isLoading, setIsLoading] = useState(true);
    const [region, setRegion] = useState(null);
    const [places, setPlaces] = useState([]);


    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Location permission not granted');
                setIsLoading(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            const newRegion = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            };

            setRegion(newRegion);
            setIsLoading(false);
        })();
    }, []);


    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <View style={styles.container}>
            <StatusBar/>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.inner}>
                    {region && (
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            style={styles.map}
                            region={region}
                            showsUserLocation={true}
                            followUserLocation={true}
                            customStyle={mapStyle}
                            tracksViewChanges={false}
                            showsIndoors={false}

                        >
                            {places && places.map((item, index) => (
                                <Marker
                                    key={index}
                                    coordinate={{
                                        latitude: item.location.coordinates.wgs84.lat,
                                        longitude: item.location.coordinates.wgs84.lon,
                                    }}
                                    title={item.name}

                                />))}

                        </MapView>
                    )}

                </View>
            </TouchableWithoutFeedback>
        </View>


    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    inner: {
        flex: 1,
        justifyContent: 'space-around',
    },

    map: {
        flex: 1,
        width: "100%",
        height: "100%"
    },

});
