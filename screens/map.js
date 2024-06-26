import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  StatusBar,
  Platform,
  Alert,
  BackHandler
} from 'react-native';
import MapView from 'react-native-map-clustering';
import React, { useState, useEffect, useContext } from 'react';
import * as Location from 'expo-location';
import LoadingIndicator from '../components/Loading'
import mapStyle from '../mapStyle.json'
import useLipasFetch from '../components/lipasfetch';
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { getSportIcon } from '../components/getIcons';
import { EventContext } from "../context/EventProvider";

export default function MapScreen({ handleMarkerPress, setPlaces, mapRef, token, collapseBottomSheet, activeFilter }) {
  const [region, setRegion] = useState({
    latitude: null,
    longitude: null,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { places, fetchPlaces } = useLipasFetch(token);
  const eventLocationIds = useContext(EventContext).map(event => event.locationId);
  const [zoomLevel, setZoomLevel] = useState(0);

  useEffect(() => {
    setPlaces(places)
  }, [places])

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Location permission needed', 'Please enable location services in your device settings to use the app.', [{ text: 'OK', onPress: () => BackHandler.exitApp() }]
          );
        }

        let location = await Location.getCurrentPositionAsync({ accuracy: Platform.OS === 'android' ? Location.Accuracy.Low : Location.Accuracy.Lowest, });
        setRegion({
          ...region,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        setIsLoading(false);
        if (location.coords.latitude !== null && location.coords.longitude !== null) {
          fetchPlaces(location.coords.latitude, location.coords.longitude);
        }

        let locationWatcher = await Location.watchPositionAsync({
          accuracy: Location.Accuracy.Low,
          distanceInterval: 50,
        }, (location) => {
          setRegion({
            ...region,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          if (location.coords.latitude !== null && location.coords.longitude !== null) {
            fetchPlaces(location.coords.latitude, location.coords.longitude);
          }
        });

        return () => {
          if (locationWatcher) {
            locationWatcher.remove();
          }
        };

      } catch (error) {
        console.log(error)
      }
    })();
  }, []);

  const handleMapPress = () => {
    Keyboard.dismiss()
    collapseBottomSheet()
  }

  if (isLoading) {
    return <LoadingIndicator />;
  }

  const onRegionChangeComplete = (region) => {
    const longitudeDelta = region.longitudeDelta;
    const zoomLevel = Math.round(Math.log(360 / longitudeDelta) / Math.LN2);
    setZoomLevel(zoomLevel);
  };

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
              radius={zoomLevel > 10 ? 20 : zoomLevel > 5 ? 10 : 1}
              extent={350}
              nodeSize={64}
              onRegionChangeComplete={onRegionChangeComplete}
              minPoints={2}
            >
              {places && places.map((item, index) => {
                const icon = getSportIcon(item.properties.tyyppi_nim, 'map');
                if (icon === null || (activeFilter && icon !== activeFilter.uri2)) {
                  return null;
                }
                const locationHasEvent = eventLocationIds.includes(item.properties.id)
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
                    opacity={locationHasEvent ? 1.0 : 0.7}
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
