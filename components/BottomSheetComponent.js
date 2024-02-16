import BottomSheet from '@gorhom/bottom-sheet';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import SearchBarComponent from './SearchBarComponent';

const BottomSheetComponent = () => {

  const snapPoints = useMemo(() => ['3.5%', '15%'], []);

  return (

      <BottomSheet index={1} snapPoints={snapPoints}>
        <View style={styles.contentContainer}>
          <SearchBarComponent />
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