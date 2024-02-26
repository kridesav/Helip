import BottomSheet from '@gorhom/bottom-sheet';
import { useMemo } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import SearchBarComponent from './SearchBarComponent';

const BottomSheetComponent = ({bottomSheetRef, selectedMapItem, setSelectedMapItem, collapseBottomSheet}) => {

  const snapPoints = useMemo(() => ['3.5%', '15%', '50%'], []);

  return (
      <BottomSheet index={1} snapPoints={snapPoints} ref={bottomSheetRef}>
        <View style={styles.contentContainer}>
          <SearchBarComponent />
          <Text>{selectedMapItem ? selectedMapItem.name : ''}</Text>
          <Button onPress={function(){
            setSelectedMapItem(null)
            collapseBottomSheet()
          }} title='collapseBottomSheet'></Button>
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