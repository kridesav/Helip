import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useMemo } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import SearchBarComponent from './SearchBarComponent';

const BottomSheetComponent = ({places, filteredLocations, setFilteredLocations, bottomSheetRef, selectedMapItem, setSelectedMapItem, collapseBottomSheet}) => {

  const snapPoints = useMemo(() => ['3.5%', '15%', '50%', '90%'], []);

  return (
      <BottomSheet index={1} snapPoints={snapPoints} ref={bottomSheetRef}>
        <View style={styles.contentContainer}>
          <SearchBarComponent setFilteredLocations={setFilteredLocations} places={places} />
          {selectedMapItem ? 
          <View>
            <Text>{selectedMapItem.properties.nimi_fi}</Text>
            <Text>{selectedMapItem.properties.www}</Text>
            <Text>{selectedMapItem.properties.katuosoite}</Text>
            <Button onPress={function(){
              setSelectedMapItem(null)
              /* collapseBottomSheet() */
            }} title='Back'></Button>
          </View>
          :
          <BottomSheetScrollView>
            {filteredLocations.map((item) => 
            <View key={item.properties.id} style={{padding: 20, marginVertical: 8, marginHorizontal: 16,}}>
              <Text>{item.properties.nimi_fi}</Text>
            </View>)}
          </BottomSheetScrollView>
          }
        </View>
      </BottomSheet>
   
  );
}

const styles = StyleSheet.create({

  contentContainer: {
    flex: 1,
    alignItems: 'center',
  }
});

export default BottomSheetComponent;