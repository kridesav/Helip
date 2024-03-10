import * as React from "react";
import { useState, useEffect, useContext} from "react";
import Maps from "./screens/map";
import { Text, View, Button, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import BottomSheetComponent from "./components/BottomSheetComponent";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AuthStack from "./screens/login/authStack";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./config/firebaseConfig";
import { createStackNavigator } from "@react-navigation/stack";
import AddEventScreen from "./screens/events/AddEventScreen"
import EventScreen from "./screens/events/EventScreen";
import EditEventScreen from "./screens/events/EditEventScreen";
import { PaperProvider } from 'react-native-paper';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from 'react-native-paper';
import { useFetchCurrentUserProfile } from "./hooks/useFetchCurrentUserProfile";
import { EventProvider, EventContext } from './context/EventProvider'
import theme from './theme'

const Stack = createStackNavigator();

//placeholder
function HomeScreen() {
  const { colors } = useTheme();
  
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.tertiary }}>
      <View >
        {eventIds.length > 0 ? (
          eventIds.map(event => (
            <View key={event.id} style={{ marginBottom: 10 }}>
              <TouchableOpacity>
                <Text>{event.title} - ({event.date})</Text>
                {event.isFull && <Text style={styles.fullText}>Event Full</Text>}
              </TouchableOpacity>
            </View>

          ))
        ) : (
          <Text>No events for this location.</Text>
        )}
      </View>
    </View>
  );
}

//placeholder
function ProfileScreen() {

  const { colors } = useTheme();
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User logged out");
      })
      .catch((error) => {
        console.error("Logout Error:", error);
      });
  };

  const { profile } = useFetchCurrentUserProfile();


  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.tertiary }}>
      <Text >Settings!</Text>
      <Text style={{ marginTop: 10 }}>Profile Data:</Text>
      <Text style={{ marginTop: 5 }}>Email: {profile?.email ?? 'No email'}</Text>
      <Text style={{ marginTop: 5 }}>Name: {profile?.firstName ?? 'No first name'} {profile?.lastName ?? 'No last name'}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}


function MapScreen({ handleListItemPress, mapRef, handleMarkerPress, token, places, setPlaces, filteredLocations, setFilteredLocations, bottomSheetRef, setSelectedMapItem, selectedMapItem }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Maps
        token={token}
        setPlaces={setPlaces}
        handleMarkerPress={handleMarkerPress}
        mapRef={mapRef} />
      <BottomSheetComponent
        handleListItemPress={handleListItemPress}
        places={places}
        filteredLocations={filteredLocations}
        setFilteredLocations={setFilteredLocations}
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

  const mapRef = React.useRef(null);

  //BottomSheet manip
  const bottomSheetRef = React.useRef(null);
  const collapseBottomSheet = () => bottomSheetRef.current?.collapse();
  const expandBottomSheet = () => bottomSheetRef.current?.expand();

  const handleMarkerPress = (item) => {
    setSelectedMapItem(item)
    expandBottomSheet()
  }

  const handleListItemPress = (item) => {
    setSelectedMapItem(item)
    mapRef.current.animateToRegion({
      latitude: item.geometry.coordinates[1],
      longitude: item.geometry.coordinates[0]
    }, 1000)
  }

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
      <EventProvider>
        <NavigationContainer >
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: colors.primary,
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
                    {(props) => <MapScreen {...props}
                      token={token}
                      places={places}
                      setPlaces={setPlaces}
                      filteredLocations={filteredLocations}
                      setFilteredLocations={setFilteredLocations}
                      bottomSheetRef={bottomSheetRef}
                      setSelectedMapItem={setSelectedMapItem}
                      selectedMapItem={selectedMapItem}
                      handleMarkerPress={handleMarkerPress}
                      mapRef={mapRef}
                      handleListItemPress={handleListItemPress} />}
                  </Tab.Screen>
                </Tab.Navigator>
              )}
            </Stack.Screen>
            <Stack.Screen name="AddEventScreen" component={AddEventScreen} options={{ title: 'Add Event' }} />
            <Stack.Screen name="EventScreen" component={EventScreen} options={{ title: 'Event' }} />
            <Stack.Screen name="EditEventScreen" component={EditEventScreen} options={{ title: 'Edit Event' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </EventProvider>
    </PaperProvider>
  ) : (
    <AuthStack />
  );
}
