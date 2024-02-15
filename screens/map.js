import {
    View,
    KeyboardAvoidingView,
    StyleSheet,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import MapView from 'react-native-maps';
import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import LoadingIndicator from '../components/Loading'


export default function MapScreen() {
    const [region, setRegion] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Location permission not granted');
                setIsLoading(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            });
            setIsLoading(false);
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
                            style={styles.map}
                            region={region}
                            showsUserLocation={true}
                            followUserLocation={true}
                        >
                        </MapView>
                    )}
                     <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'position' : 'height'}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 94 : 30}
                        style={styles.keyboardAvoidingView}>
                    </KeyboardAvoidingView>
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