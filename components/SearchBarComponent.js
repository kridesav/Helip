import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

const SearchBarComponent = ({setFilteredLocations, places}) => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    const filteredLocationslocations = places.filter(function (location) {
      if (location.name.toLowerCase().includes(searchText.toLocaleLowerCase()) || location.type.name.toLowerCase().includes(searchText.toLocaleLowerCase())) {
        return true
      } else {
        return false
      }
    })
    setFilteredLocations(filteredLocationslocations)
  };

  return (
    <View style={{ width: '100%' }}>
      <BottomSheetTextInput style={styles.textInput} 
       placeholder="Search..."
       onChangeText={(text) => setSearchText(text)}
       value={searchText}
       onEndEditing={handleSearch}/>
    </View>
  );
};

export default SearchBarComponent;

const styles = StyleSheet.create({
  textInput: {
    alignSelf: "stretch",
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "grey",
    color: "white",
    textAlign: "left",
  },

});
