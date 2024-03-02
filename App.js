import * as React from "react";
import { useState, useEffect } from "react";
import Maps from "./screens/map";
import { Text, View, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import BottomSheetComponent from "./components/BottomSheetComponent";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AuthStack from "./screens/login/authStack";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./config/firebaseConfig";
import { createStackNavigator } from "@react-navigation/stack";
import AddEventScreen from "./screens/events/AddEventScreen";
import { MD3DarkTheme, PaperProvider } from 'react-native-paper';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from 'react-native-paper';

const Stack = createStackNavigator();


//react-native-paper teema
const theme = {
  ...MD3DarkTheme,
  roundness: 2,
  colors: {
    ...MD3DarkTheme.colors,
    primary: 'orange',
    secondary: '#f1c40f',
    tertiary: '#a1b2c3',
  },
};

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
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User logged out");
      })
      .catch((error) => {
        console.error("Logout Error:", error);
      });
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Settings!</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}


function MapScreen({ token, places, setPlaces, filteredLocations, setFilteredLocations, bottomSheetRef, setSelectedMapItem, selectedMapItem, collapseBottomSheet, expandBottomSheet }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Maps
        token={token}
        setPlaces={setPlaces}
        setSelectedMapItem={setSelectedMapItem}
        expandBottomSheet={expandBottomSheet} />
      <BottomSheetComponent places={places}
        filteredLocations={filteredLocations}
        setFilteredLocations={setFilteredLocations}
        collapseBottomSheet={collapseBottomSheet}
        bottomSheetRef={bottomSheetRef}
        setSelectedMapItem={setSelectedMapItem}
        selectedMapItem={selectedMapItem} />
    </GestureHandlerRootView>
  );
}

const Tab = createMaterialBottomTabNavigator();

export default function App() {
  const { colors } = useTheme();
  const [user, setUser] = useState("");
  const [selectedMapItem, setSelectedMapItem] = React.useState(null)
  const [filteredLocations, setFilteredLocations] = React.useState([])
  const [places, setPlaces] = React.useState([])
  const [token, setToken] = useState(null);

  React.useEffect(() => {
    setFilteredLocations(places)
  }, [places])

  //BottomSheet manip
  const bottomSheetRef = React.useRef(null);

  const collapseBottomSheet = () => bottomSheetRef.current?.collapse();

  const expandBottomSheet = () => bottomSheetRef.current?.expand();

  useEffect(() => {
    const unsubscribeFromAuthStatusChanged = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        setToken(token);
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return unsubscribeFromAuthStatusChanged;
  }, []);

  return user ? (
    <PaperProvider theme={theme}>
      <NavigationContainer >
        <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.tertiary,
          },
          headerTintColor: '#fff', 
          headerTitleStyle: {
            fontWeight: 'bold', 
          },
        }}>
          <Stack.Screen name="Main" options={{ headerShown: false }}>
            {() => (
              <Tab.Navigator initialRouteName="Map">
                <Tab.Screen name="Home" component={HomeScreen}
                  options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color }) => (
                      <MaterialCommunityIcons name="home" color={color} size={26} />
                    ),
                  }} />
                <Tab.Screen name="Profile" component={ProfileScreen} options={{
                  tabBarLabel: 'Profile',
                  tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="account" color={color} size={26} />
                  ),
                }} />
                <Tab.Screen name="Map" options={{
                  tabBarLabel: 'Map',
                  tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="map" color={color} size={26} />
                  ),
                }} >
                  {(props) => <MapScreen {...props} token={token} places={places} setPlaces={setPlaces} filteredLocations={filteredLocations} setFilteredLocations={setFilteredLocations} expandBottomSheet={expandBottomSheet} collapseBottomSheet={collapseBottomSheet} bottomSheetRef={bottomSheetRef} setSelectedMapItem={setSelectedMapItem} selectedMapItem={selectedMapItem} />}
                </Tab.Screen>
              </Tab.Navigator>
            )}
          </Stack.Screen>
          <Stack.Screen name="AddEventScreen" component={AddEventScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  ) : (
    <AuthStack />
  );
}
