import React, { useState } from 'react';
import { View } from 'react-native';
import { SearchBar } from 'react-native-elements';

const SearchBarComponent = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    // Perform any search logic here based on the searchText
    // onSearch(searchText);
    console.log("searching")
  };

  return (
    <View>
      <SearchBar
        placeholder="Placeholder..."
        onChangeText={(text) => setSearchText(text)}
        value={searchText}
        onEndEditing={handleSearch}
        onSubmitEditing={handleSearch}
      />
    </View>
  );
};

export default SearchBarComponent;