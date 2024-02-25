import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import Maps from './screens/map';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BottomSheetComponent from './components/BottomSheetComponent';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

//placeholder
function HomeScreen() {
  return (
    <View>
      <Text>Home!</Text>
    </View>
  );
}

//placeholder
function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}


function MapScreen({bottomSheetRef, setSelectedMapItem, selectedMapItem, collapseBottomSheet, expandBottomSheet}) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Maps setSelectedMapItem={setSelectedMapItem} expandBottomSheet={expandBottomSheet}/>
      <BottomSheetComponent collapseBottomSheet={collapseBottomSheet} bottomSheetRef={bottomSheetRef} setSelectedMapItem={setSelectedMapItem} selectedMapItem={selectedMapItem}/>
    </GestureHandlerRootView>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {

  const [ selectedMapItem, setSelectedMapItem ] = React.useState(null)

  //BottomSheet manip
  const bottomSheetRef = React.useRef(null)

  const collapseBottomSheet = () => bottomSheetRef.current?.collapse()

  const expandBottomSheet = () => bottomSheetRef.current?.expand()

  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName='Map'>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Map">
        {(props) => <MapScreen {...props} expandBottomSheet={expandBottomSheet} collapseBottomSheet={collapseBottomSheet} bottomSheetRef={bottomSheetRef} setSelectedMapItem={setSelectedMapItem} selectedMapItem={selectedMapItem} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}