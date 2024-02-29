import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar
} from 'react-native';
import MapView from 'react-native-maps';
import React, { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import LoadingIndicator from '../components/Loading'
import mapStyle from '../mapStyle.json'
import useLipasFetch from '../components/lipasfetch';
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { debounce } from 'lodash';


export default function MapScreen({ setSelectedMapItem, expandBottomSheet, setPlaces, token }) {
  const [region, setRegion] = useState({
    latitude: null,
    longitude: null,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { places, fetchPlaces } = useLipasFetch(token);

  useEffect(() => {
    setPlaces(places)
  }, [places])

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
        distanceInterval: 5,
      }, debounce((location) => {
        setRegion({
          ...region,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        setIsLoading(false);
        if (location.coords.latitude !== null && location.coords.longitude !== null) {
          fetchPlaces(location.coords.latitude, location.coords.longitude);
        }
      }, 10000)
      );

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
      <StatusBar />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          {region && (
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={region}
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
                    latitude: item.geometry.coordinates[1],
                    longitude: item.geometry.coordinates[0],
                  }}
                  title={item.properties.nimi_fi}
                  onPress={function (e) {
                    setSelectedMapItem(item)
                    expandBottomSheet()
                  }
                  }
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
