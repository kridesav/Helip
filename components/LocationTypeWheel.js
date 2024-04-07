import { useEffect } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { Image, TouchableOpacity, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAllSportsIcons } from './getIcons';
import useAuth from '../hooks/useAuth';

const icons = getAllSportsIcons()

export default function LocationTypeWheel({setPlaceTypeFilter, placeTypeFilter}) {

  const { currentUser } = useAuth();
  const userId = currentUser?.uid;

  useEffect(() => {
    _retrieveFiler()
  },[])

  _storeFilter = async (filterBP) => {
    try {
      await AsyncStorage.setItem(
        `${userId}:filter`,
        `${filterBP.join(',')}`,
      );
    } catch (error) {
      console.log(error)
    }
  };
  _retrieveFiler = async () => {
    try {
      const value = await AsyncStorage.getItem(`${userId}:filter`,);
      if (value !== null) {
        // We have data!!
        setPlaceTypeFilter(value.split(','))
      }
    } catch (error) {
      console.log(error)
    }
  };

  const handleIconPress = (item) => {
    console.log(item)
    if (placeTypeFilter.includes(item)){
      setPlaceTypeFilter(oldValues => {
        return oldValues.filter(arrayItem => arrayItem !== item)
      })
    } else {
      setPlaceTypeFilter([...placeTypeFilter, item])
      _storeFilter([...placeTypeFilter, item])
      console.log([...placeTypeFilter, item])
    }
  }

  return (
    <View style={styles.container}>
        <ScrollView horizontal={true}>
            {icons.map((item,index) => 
                <TouchableOpacity style={[styles.icon_container, placeTypeFilter.includes(item.uri.toString()) ? styles.selected : '']} key={index} activeOpacity={0.5} onPressOut={() => handleIconPress(item.uri.toString())}>
                    <Image
                    source={item.uri}
                    />
                </TouchableOpacity> 
            )}
        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    height: 55
  },
  selected:{
    backgroundColor: 'gray'
  },
  icon_container:{
    borderRadius:5,
    padding:5
  }
})