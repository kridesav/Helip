import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

const SearchBarComponent = ({setFilteredLocations, places}) => {

  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (searchText.length >= 2) {
      handleSearch(searchText)
    } else {
      setFilteredLocations(places)
    }
  }, [places, searchText])

  const handleSearch = (text) => {
    const filteredLocations= places.filter(function (location) {
      if (location.properties.nimi_fi.toLowerCase().includes(text.toLocaleLowerCase()) || location.properties.nimi_fi.toLowerCase().includes(text.toLocaleLowerCase())) {
        return true
      } else {
        return false
      }
    })
    setFilteredLocations(filteredLocations)
  };

  return (
    <View style={{ width: '100%' }}>
      <BottomSheetTextInput style={styles.textInput} 
       placeholder="Search..."
       onChangeText={setSearchText}
       value={searchText}/>
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
