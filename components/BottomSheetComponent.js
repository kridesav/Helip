import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import SearchBarComponent from './SearchBarComponent';
import { useNavigation } from '@react-navigation/native';
import { Button as NativeButton }  from 'react-native';

const BottomSheetComponent = ({ places, filteredLocations, setFilteredLocations, bottomSheetRef, selectedMapItem, setSelectedMapItem, collapseBottomSheet }) => {

  const snapPoints = useMemo(() => ['3.5%', '15%', '50%', '90%'], []);

  const navigation = useNavigation();
  const handleAddEventPress = () => {
    navigation.navigate('AddEventScreen', { selectedMapItem });
  };

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
          </View>
          :
          <BottomSheetScrollView>
            {filteredLocations.map((item) =>
              <View key={item.properties.id} style={{ padding: 20, marginVertical: 8, marginHorizontal: 16, borderWidth: 1, borderRadius: 10 }}>
                <NativeButton style={{ backgroundColor: 'white' ,color: 'black'}} onPress={() => setSelectedMapItem(item)} title={item.properties.nimi_fi}></NativeButton>
              </View>) || []}
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
});

export default BottomSheetComponent;