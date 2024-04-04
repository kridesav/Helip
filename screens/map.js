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
import { getSportIcon } from '../components/getIcons';


export default function MapScreen({ handleMarkerPress, setPlaces, mapRef, token, collapseBottomSheet }) {
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

  const handleMapPress = () => {
    Keyboard.dismiss()
    collapseBottomSheet()
  } 

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      <StatusBar />
      <TouchableWithoutFeedback onPress={handleMapPress}>
        <View style={styles.inner}>
          {region && (
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={region}
              showsUserLocation={true}
              showsMyLocationButton={true}
              followUserLocation={true}
              customMapStyle={mapStyle}
              tracksViewChanges={false}
              showsIndoors={false}
              scrollEnabled={true}
              mapPadding={{ top: 0, right: 0, left: 0, bottom: 25 }}
            >
              {places && places.map((item, index) => {
                const icon = getSportIcon(item.properties.tyyppi_nim, 'map');
                if (icon === null) {
                  return null;
                }
                return (
                  <Marker
                    key={index}
                    coordinate={{
                      latitude: item.geometry.coordinates[1],
                      longitude: item.geometry.coordinates[0],
                    }}
                    title={item.properties.nimi_fi}
                    onPress={() => handleMarkerPress(item)}
                    image={icon}
                  />
                );
              })}

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
