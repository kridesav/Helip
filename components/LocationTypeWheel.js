import { ScrollView } from 'react-native-gesture-handler';
import { Image, TouchableOpacity, SafeAreaView } from 'react-native';

const icons = [
    {name: 'footballIcon', uri: require('../assets/football.png')},
    {name: 'gymIcon', uri: require('../assets/gym.png')},
    {name: 'swimmingIcon', uri: require('../assets/swimming-pool.png')},
    {name: 'defaultIcon', uri: require('../assets/default.png')},
    {name: 'golfIcon', uri: require('../assets/golf.png')},
    {name: 'iceSkatingIcon', uri: require('../assets/iceskating.png')},
    {name: 'basketballIcon', uri: require('../assets/basketball.png')},
    {name: 'runningIcon', uri: require('../assets/running.png')},
    {name: 'tennisIcon', uri: require('../assets/tennis.png')},
    {name: 'hockeyIcon', uri: require('../assets/hockey.png')},
    {name: 'boxingIcon', uri: require('../assets/boxing.png')},
    {name: 'volleyballIcon', uri: require('../assets/volleyball.png')},
    {name: 'infoIcon', uri: require('../assets/info.png')},
    {name: 'skateIcon', uri: require('../assets/skate.png')},
    {name: 'danceIcon', uri: require('../assets/dance.png')},
    {name: 'baseballIcon', uri: require('../assets/baseball.png')},
    {name: 'motorsportsIcon', uri: require('../assets/motorsports.png')},
    {name: 'petsIcon', uri: require('../assets/pets.png')}
]


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