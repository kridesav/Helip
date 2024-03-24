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
import footballIcon from '../assets/football.png';
import gymIcon from '../assets/gym.png';
import swimmingIcon from '../assets/swimming-pool.png';
import defaultIcon from '../assets/default.png';
import golfIcon from '../assets/golf.png';
import iceSkatingIcon from '../assets/iceskating.png';
import basketballIcon from '../assets/basketball.png';
import runningIcon from '../assets/running.png';
import tennisIcon from '../assets/tennis.png';
import hockeyIcon from '../assets/hockey.png';
import boxingIcon from '../assets/boxing.png';
import volleyballIcon from '../assets/volleyball.png';
import infoIcon from '../assets/info.png';
import skateIcon from '../assets/skate.png';
import danceIcon from '../assets/dance.png';
import baseballIcon from '../assets/baseball.png';
import motorsportsIcon from '../assets/motorsports.png';
import petsIcon from '../assets/pets.png';


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

  if (isLoading) {
    return <LoadingIndicator />;
  }

  function getSportIcon(type) {
    switch (true) {
      case type === 'Pallokenttä' || type === 'Jalkapallohalli' || type === 'Jalkapallostadion':
        return footballIcon;
      case type === 'Kuntosali' || type === 'Ulkokuntoilupaikka' || type === 'Liikuntapuisto' || type === 'Liikuntahalli' || type === 'Liikuntasali' || type === 'Kuntokeskus' || type === 'Voimailusali' || type === 'Lähiliikuntapaikka' || type === 'Naisten kuntokeskus':
        return gymIcon;
      case type === 'Uimahalli' || type === 'Uimaranta' || type === 'Uimapaikka' || type === 'Talviuintipaikka' || type === 'Uima-allas' || type === 'Maauimala':
        return swimmingIcon;
      case type === 'Ratagolf' || type === 'Golfkenttä' || type === 'Golfin harjoitusalue' || type === 'Golfin harjoitushalli' || type === 'Frisbeegolfrata':
          return golfIcon;
      case type === 'Koripallokenttä':
        return basketballIcon;
      case type === 'Luistelukenttä' || type === 'Luistelureitti' || type === 'Pikaluistelurata':
        return iceSkatingIcon;
      case type === 'Juoksurata' || type === 'Yleisurheilukenttä' || type === 'Yleisurheilun harjoitusalue' || type === 'Juoksusuora' || type === 'Yksittäinen yleisurheilun suorituspaikka' || type === 'Monitoimihalli/areena':
        return runningIcon;
      case type === 'Tenniskenttä' || type === 'Tenniskenttäalue' || type === 'Tennishalli' || type === 'Tenniskeskus' || type === 'Tenniskentät' || type === 'Padelhalli' || type === 'Padelkenttäalue' || type === 'Pöytätennistila' || type === 'Squash-halli' || type === 'Sulkapallohalli':
        return tennisIcon;
      case type === 'Kaukalo' || type === 'Jääkiekkokaukalo' || type === 'Harjoitusjäähalli' || type === 'Tekojääkenttä':
        return hockeyIcon;
      case type === 'Kamppailulajien sali':
        return boxingIcon;
      case type === 'Lentopallokenttä' || type === 'Beachvolleykenttä':
        return volleyballIcon;
      case type === 'Opastuspiste':
        return infoIcon;
      case type === 'Skeitti-/rullaluistelupaikka':
        return skateIcon;
      case type === 'Tanssisali' || type === 'Tanssitila':
        return danceIcon;
      case type === 'Pesäpallokenttä':
        return baseballIcon;
      case type === 'Moottorirata' || type === 'Karting-rata' || type === 'Moottoripyöräilyalue':
        return motorsportsIcon;
      case type === 'Koiraurheilualue' || type === 'Koirapuisto' || type === 'Koirien uintipaikka' || type === 'Koiraurheiluhalli':
        return petsIcon;
      default:
        return defaultIcon;
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
              onPress={collapseBottomSheet}
              mapPadding={{top:0, right:0, left:0, bottom:25}}
            >
              {places && places.map((item, index) => (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: item.geometry.coordinates[1],
                    longitude: item.geometry.coordinates[0],
                  }}
                  title={item.properties.nimi_fi}
                  onPress={() => handleMarkerPress(item)}
                  image={getSportIcon(item.properties.tyyppi_nim)}
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
