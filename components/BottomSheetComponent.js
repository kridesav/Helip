import { StatusBar } from 'expo-status-bar';
import BottomSheet from '@gorhom/bottom-sheet';
import { useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import SearchBarComponent from './SearchBarComponent';

const BottomSheetComponent = () => {
  const snapPoints = useMemo(() => ['5%', '15%'], []);

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
    width: '100%'
	}
});

export default BottomSheetComponent;