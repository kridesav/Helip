import { ScrollView } from 'react-native-gesture-handler';
import { Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { getAllSportsIcons } from './getIcons';

const icons = getAllSportsIcons()

export default function LocationTypeWheel() {
  return (
    <SafeAreaView style={{flex: 1,height:80}}>
        <ScrollView horizontal={true} style={{height:80}}>
            {icons.map((item,index) => 
                <TouchableOpacity key={index} activeOpacity={0.5}>
                    <Image
                    source={item.uri}
                    />
                </TouchableOpacity> 
            )}
        </ScrollView>
    </SafeAreaView>
  );
}