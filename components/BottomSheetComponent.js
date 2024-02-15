import { StatusBar } from 'expo-status-bar';
import BottomSheet from '@gorhom/bottom-sheet';
import { useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import SearchBarComponent from './SearchBarComponent';

const BottomSheetComponent = () => {
  const snapPoints = useMemo(() => ['5%', '50%', '100%'], []);

	return (
    <BottomSheet index={1} snapPoints={snapPoints}>
      <View style={styles.contentContainer}>
        <Text style={styles.containerHeadline}>Bottom Sheet</Text>
      </View>
    </BottomSheet>
	);
}

const styles = StyleSheet.create({
	contentContainer: {
		flex: 1,
		alignItems: 'center'
	},
	containerHeadline: {
		fontSize: 24,
		fontWeight: '600',
		padding: 20
	}
});

export default BottomSheetComponent;