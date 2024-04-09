import { ScrollView } from 'react-native-gesture-handler';
import { Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { getAllSportsIcons } from './getIcons';
import React, { useEffect, useState } from 'react';

const icons = getAllSportsIcons()

export default function LocationTypeWheel({ onActiveIconChange }) {
  const [activeIcon, setActiveIcon] = useState(null)

  useEffect(() => {
    onActiveIconChange(activeIcon)
  }, [activeIcon])

  function handleFilter(id) {
    if (activeIcon !== id) {
      setActiveIcon(id)
    } else {
      setActiveIcon(null)
    }
  }
  
  return (
    <SafeAreaView style={{height:40}}>
        <ScrollView horizontal={true} style={{height:20, marginHorizontal: 15}} showsHorizontalScrollIndicator={false}>
            {icons.map((item,index) => 
                <TouchableOpacity key={index} activeOpacity={0.5} onPress={() => handleFilter(item)}>
                <Image
                source={item.uri}
                style={[
                  { width: 35, height: 35, marginHorizontal: 2 },
                  activeIcon === item && { borderWidth: 2, borderRadius: 20, borderColor: 'black'}
                ]}
                />
            </TouchableOpacity> 
            )}
        </ScrollView>
    </SafeAreaView>
  );
}