import {
    View,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import MapView from 'react-native-maps';
import React, { useState, useEffect  } from 'react';
import * as Location from 'expo-location';
import LoadingIndicator from '../components/Loading'
import mapStyle from '../mapStyle.json'
import useLipasFetch from '../components/lipasfetch';
import { Marker, PROVIDER_GOOGLE} from 'react-native-maps';


export default function MapScreen() {

    const [isLoading, setIsLoading] = useState(true);
    const [region, setRegion] = useState({
        latitude: null,
        longitude: null,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
    });

    const places = useLipasFetch(region.latitude, region.longitude, 0.7);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Location permission not granted');
                setIsLoading(false);
                return;
            }

            let locationWatcher = await Location.watchPositionAsync({
                accuracy: Location.Accuracy.High,
                timeInterval: 1000,
                distanceInterval: 1,
            }, (location) => {
                setRegion({
                    ...region,
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });
                setIsLoading(false);
            });

            return () => {
                if (locationWatcher) {
                    locationWatcher.remove();
                }
            };
        })();
    }, []);

    if (isLoading) {
        return <LoadingIndicator />;
    }

    return (
        <View style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.inner}>
                    {region && (
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            style={styles.map}
                            region={region}
                            showsUserLocation={true}
                            followUserLocation={true}
                            customMapStyle={mapStyle}
                            tracksViewChanges={false}
                            showsIndoors={false}

                        >
                            {places && places.map((item, index) => (
                                <Marker
                                    pinColor='green'
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
