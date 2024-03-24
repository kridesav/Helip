import React from 'react';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useMemo, useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, Pressable, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-paper';
import SearchBarComponent from './SearchBarComponent';
import LocationTypeWheel from './LocationTypeWheel';
import { useNavigation } from '@react-navigation/native';
import { useFetchEventsByLocationId } from '../hooks/events/useFetchEventsByLocationId';
import { useTheme } from 'react-native-paper';
import { Button as IconButton } from 'react-native-elements';
import theme from '../theme'

const BottomSheetComponent = ({ handleListItemPress, places, filteredLocations, setFilteredLocations, bottomSheetRef, selectedMapItem, handleMapItemDeselect }) => {

  const snapPoints = useMemo(() => ['3.5%', '15%', '40%', '80%'], []);
  const [ pageNumber, setPageNumber ] = useState(0);
  const [ settingMode, setSettingsMode ] = useState(false);
  const { colors } = useTheme();
  const navigation = useNavigation();


  //Hakee locationId:n mukaan eventit
  const [locationId, setLocationId] = useState(null);
  useEffect(() => {
    if (selectedMapItem && selectedMapItem.properties) {
      setLocationId(selectedMapItem.properties.id);
    } else {
      setLocationId(null);
    }
  }, [selectedMapItem]);

  const { events } = useFetchEventsByLocationId(locationId);


  
  const dynamicStyles = {
    fullButton: {
      backgroundColor: colors.danger,
    },
    fullButtonText: {
      color: colors.tertiary,
    },
  };


  const NativeButton = (props) => {
    return (
      <Pressable style={styles.button} onPress={props.onPress}>
        <Text style={styles.text}>{props.title}</Text>
      </Pressable>
    );
  }

  return (
    <BottomSheet index={1} snapPoints={snapPoints} ref={bottomSheetRef} keyboardBehavior='interactive' android_keyboardInputMode='adjustResize' keyboardBlurBehavior="restore">
      <View style={styles.contentContainer}>
        {selectedMapItem ?
          <View style={styles.dataContainer}>
            <Text>{selectedMapItem.properties.nimi_fi}</Text>
            <Text>{selectedMapItem.properties.www}</Text>
            <Text>{selectedMapItem.properties.katuosoite}</Text>
            <View style={styles.buttonContainer}>
              <Button icon="plus-circle" mode="elevated" style={styles.control} title="Add Event" onPress={() => navigation.navigate('AddEventScreen', { selectedMapItem })}>Add Event</Button>
              <Button onPress={() => handleMapItemDeselect()} icon="arrow-left-circle" mode="elevated" style={styles.control} title="Back">Back</Button>
            </View>
            <BottomSheetScrollView>
              <View style={styles.dataContainer} >
                {events.length > 0 ? (
                  events.map(event => (
                    <View key={event.id} style={{ marginBottom: 10 }}>
                      <TouchableOpacity onPress={() => navigation.navigate('EventScreen', { event, isFull: event.participants >= event.participantLimit  })} style={[styles.button, event.isFull ? dynamicStyles.fullButton : {}]}>
                        <Text style={styles.buttonText}>{event.title} - ({event.date})</Text>
                        {event.isFull && <Text style={styles.fullText}>Event Full</Text>}
                      </TouchableOpacity>
                    </View>

                  ))
                ) : (
                  <Text>No events for this location.</Text>
                )}
              </View>
            </BottomSheetScrollView>

          </View>
          :
          !settingMode?
          <>
          <View style={{ width: '100%', flexDirection: 'row' }}>
            <SearchBarComponent setFilteredLocations={setFilteredLocations} places={places} />
            <IconButton onPress={() => setSettingsMode(true)} containerStyle={{paddingTop:5}} icon={{name: "settings"}} type="clear"></IconButton>
          </View>
            <BottomSheetScrollView>
              {
                filteredLocations.slice(pageNumber * 50, pageNumber * 50 + 50).map((item) =>
                <View key={item.properties.id}>
                  <NativeButton  onPress={() => handleListItemPress(item)} title={item.properties.nimi_fi}></NativeButton>
                </View>) || []
              }
            </BottomSheetScrollView>
          </>
          : 
          <View>
            <NativeButton onPress ={() => setSettingsMode(false)} title={"back"}></NativeButton>
            <LocationTypeWheel />
          </View>
      }
      </View>
    </BottomSheet>

  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 10,
    marginTop: 10,
  },
  dataContainer: {
    padding: 10,
    marginTop: 10,
    marginBottom: 15,

  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',

  },
  control: {
    marginTop: 20,

  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
  },
  fullText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
  },

});

export default BottomSheetComponent;