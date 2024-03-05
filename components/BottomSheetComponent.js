import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useMemo, useState, useEffect } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Button } from 'react-native-paper';
import SearchBarComponent from './SearchBarComponent';
import { useNavigation } from '@react-navigation/native';
import { useFetchEventsByLocationId } from '../hooks/useFetchEventsByLocationId';


const BottomSheetComponent = ({ handleListItemPress, places, filteredLocations, setFilteredLocations, bottomSheetRef, selectedMapItem, setSelectedMapItem, collapseBottomSheet }) => {

  const snapPoints = useMemo(() => ['3.5%', '15%', '50%', '90%'], []);
  const [ pageNumber, setPageNumber ] = useState(0)

  const navigation = useNavigation();
  const handleAddEventPress = () => {
    navigation.navigate('AddEventScreen', { selectedMapItem });
  };

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
        <SearchBarComponent setFilteredLocations={setFilteredLocations} places={places} />
        {selectedMapItem ?
          <View style={styles.dataContainer}>
            <Text>{selectedMapItem.properties.nimi_fi}</Text>
            <Text>{selectedMapItem.properties.www}</Text>
            <Text>{selectedMapItem.properties.katuosoite}</Text>
            <View style={styles.buttonContainer}>
              <Button icon="plus-circle" mode="elevated" style={styles.control} title="Add Event" onPress={handleAddEventPress}>Add Event</Button>
              <Button onPress={function () {
                setSelectedMapItem(null)
                /* collapseBottomSheet() */
              }} icon="arrow-left-circle" mode="elevated" style={styles.control} title="Back">Back</Button>
            </View>
            <View style={styles.dataContainer} >
              {events.length > 0 ? (
                events.map(event => (
                  <View key={event.id}>
                    <Text>{event.title}</Text>
                    <Text>{event.date}</Text>
                  </View>
                ))
              ) : (
                <Text>No events for this location.</Text>
              )}
            </View>
          </View>

          :
          <BottomSheetScrollView>
            {
              filteredLocations.slice(pageNumber * 100, pageNumber * 100 + 100).map((item) =>
              <View key={item.properties.id}>
                <NativeButton  onPress={() => handleListItemPress(item)} title={item.properties.nimi_fi}></NativeButton>
              </View>) || []
            }
          </BottomSheetScrollView>
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
});

export default BottomSheetComponent;