import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useMemo } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import SearchBarComponent from './SearchBarComponent';
import { useNavigation } from '@react-navigation/native';

const BottomSheetComponent = ({ places, filteredLocations, setFilteredLocations, bottomSheetRef, selectedMapItem, setSelectedMapItem, collapseBottomSheet }) => {

  const snapPoints = useMemo(() => ['3.5%', '15%', '50%', '90%'], []);

  const navigation = useNavigation();
  const handleAddEventPress = () => {
    navigation.navigate('AddEventScreen', { selectedMapItem });
  };

  return (
    <BottomSheet index={1} snapPoints={snapPoints} ref={bottomSheetRef}>
      <View style={styles.contentContainer}>
        <SearchBarComponent setFilteredLocations={setFilteredLocations} places={places} />
        {selectedMapItem ?
          <View>
            <Text>{selectedMapItem.name}</Text>
            <Text>{selectedMapItem.www}</Text>
            <Text>{selectedMapItem.location.address}</Text>
            <View style={styles.buttonContainer}>
              <Button title="Add Event" onPress={handleAddEventPress} />
              <Button onPress={function () {
                setSelectedMapItem(null)
                /* collapseBottomSheet() */
              }} title='Back'></Button>
            </View>
          </View>
          :
          <BottomSheetScrollView>
            {filteredLocations.map((item) =>
              <View key={item.location.locationId} style={{ padding: 20, marginVertical: 8, marginHorizontal: 16, }}>
                <Text>{item.name}</Text>
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
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  }
});

export default BottomSheetComponent;