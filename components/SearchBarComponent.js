import React, { useState } from 'react';
import { View } from 'react-native';
import { SearchBar } from 'react-native-elements';

const SearchBarComponent = ({ /* locations */ }) => {
  const [searchText, setSearchText] = useState('');
  //placeholder for data
  const locations = [{"properties":{"pier":true,"boatLaunchingSpot":true,"infoFi":"Venepaikkoja 17 (paikkojen leveys 2,5m), veneiden talvisäilytysalue (nostojärjestysalue), jäte, aitaamaton, veneluiska, paikat aisapaikkoja."},"email":"venepaikkavaraukset@hel.fi","admin":"Kunta / liikuntatoimi","www":"https://www.hel.fi/helsinki/fi/kulttuuri-ja-vapaa-aika/ulkoilu/veneily/kaupungin-venepaikat/kaupungin-venesatamat/koivuniemen-venesatama","name":"Koivuniemen venesatama","type":{"typeCode":203,"name":"Veneilyn palvelupaikka"},"lastModified":"2023-07-17 09:58:15.098","sportsPlaceId":74150,"phoneNumber":"09 310 87900","location":{"address":"Marjaniemenranta 1a","coordinates":{"wgs84":{"lon":25.0977220268649,"lat":60.200780732634},"tm35fin":{"lon":394548.73296512,"lat":6675291.30791502}},"locationId":585753,"city":{"name":"Helsinki","cityCode":91},"postalOffice":"HELSINKI","postalCode":"00930","neighborhood":"Vartiokylä","geometries":{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"coordinates":[25.0977220268649,60.200780732634],"type":"Point"},"properties":{"pointId":580111}}]},"sportsPlaces":[74150]},"owner":"Kunta"}]

  const handleSearch = () => {
    const filteredLocationslocations = locations.filter(function(location){
      if(location.name.toLowerCase().includes(searchText.toLocaleLowerCase()) || location.type.name.toLowerCase().includes(searchText.toLocaleLowerCase())){
        return true
      } else {
        return false
      }
    })
    console.log(filteredLocationslocations)
  };

  return (
    <View style={{width: '100%'}}>
      <SearchBar
        placeholder="Placeholder..."
        onChangeText={(text) => setSearchText(text)}
        value={searchText}
        onEndEditing={handleSearch}
      />
    </View>
  );
};

export default SearchBarComponent;