import * as React from "react";
import { useState, useEffect } from "react";
import Maps from "./screens/map";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import BottomSheetComponent from "./components/Bottomsheet/BottomSheetComponent";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AuthStack from "./screens/login/authStack";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebaseConfig";
import { createStackNavigator } from "@react-navigation/stack";
import AddEventScreen from "./screens/events/AddEventScreen";
import EventScreen from "./screens/events/EventScreen";
import EditEventScreen from "./screens/events/EditEventScreen";
import HomeScreen from "./screens/home";
import MyEventsScreen from "./screens/MyEvents";
import { PaperProvider } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from "react-native-paper";
import { EventProvider } from "./context/EventProvider";
import { darkTheme, lightTheme } from "./theme";
import Profile from "./screens/profile";
import EditProfileScreen from "./screens/profile/EditProfileScreen";
import SettingsScreen from "./screens/profile/SettingsScreen";
import { themeContext } from "./utils/themeContext";
import MessageScreen from "./screens/profile/messageScreen";

const Stack = createStackNavigator();

//placeholder
function ProfileScreen() {
  return <Profile />;
}

function MapScreen({
  collapseBottomSheet,
  handleListItemPress,
  mapRef,
  handleMarkerPress,
  token,
  places,
  setPlaces,
  filteredLocations,
  setFilteredLocations,
  bottomSheetRef,
  handleMapItemDeselect,
  selectedMapItem,
}) {
  const [activeFilter, setActiveFilter] = useState(null);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Maps
        collapseBottomSheet={collapseBottomSheet}
        token={token}
        setPlaces={setPlaces}
        handleMarkerPress={handleMarkerPress}
        mapRef={mapRef}
        activeFilter={activeFilter}
      />

      <BottomSheetComponent
        handleListItemPress={handleListItemPress}
        places={places}
        filteredLocations={filteredLocations}
        setFilteredLocations={setFilteredLocations}
        bottomSheetRef={bottomSheetRef}
        handleMapItemDeselect={handleMapItemDeselect}
        selectedMapItem={selectedMapItem}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />
    </GestureHandlerRootView>
  );
}

const Tab = createMaterialBottomTabNavigator();

export default function App() {
  const { colors } = useTheme();
  const [user, setUser] = useState("");
  const [selectedMapItem, setSelectedMapItem] = React.useState(null);
  const [filteredLocations, setFilteredLocations] = React.useState([]);
  const [places, setPlaces] = React.useState([]);
  const [token, setToken] = useState(null);
  const [themeMode, setThemeMode] = useState("dark");
  const [theme, setTheme] = useState(themeMode === "dark" ? darkTheme : lightTheme);


  const mapRef = React.useRef(null);

  useEffect(() => {
    setTheme(themeMode === "dark" ? darkTheme : lightTheme);
  }, [themeMode]);

  //BottomSheet manip
  const bottomSheetRef = React.useRef(null);
  const snapToMiddle = () => bottomSheetRef.current?.snapToIndex(2);
  const collapseBottomSheet = () => bottomSheetRef.current?.snapToIndex(1);

  const handleMarkerPress = (item) => {
    setSelectedMapItem(item);
    snapToMiddle();
  };

  const handleListItemPress = (item) => {
    setSelectedMapItem(item);
    mapRef.current.animateToRegion(
      {
        latitude: item.geometry.coordinates[1],
        longitude: item.geometry.coordinates[0],
      },
      1000
    );
    snapToMiddle();
  };

  const handleMapItemDeselect = () => {
    setSelectedMapItem(null);
    snapToMiddle();
  };

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
    <themeContext.Provider value={{ theme, setTheme, themeMode, setThemeMode }}>
      <PaperProvider theme={theme}>
        <EventProvider>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerStyle: {
                  backgroundColor: colors.primary,
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                  fontWeight: "bold",
                },
              }}
            >
              <Stack.Screen name="Main" options={{ headerShown: false }}>
                {() => (
                  <Tab.Navigator initialRouteName="Map">
                    <Tab.Screen
                      name="Home"
                      component={HomeScreen}
                      options={{
                        tabBarLabel: "Home",
                        tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home" color={color} size={26} />,
                      }}
                    />
                    <Tab.Screen
                      name="My Events"
                      component={MyEventsScreen}
                      options={{
                        tabBarLabel: "My Events",
                        tabBarIcon: ({ color }) => <MaterialCommunityIcons name="text-account" color={color} size={26} />,
                      }}
                    />
                    <Tab.Screen
                      name="Profile"
                      component={ProfileScreen}
                      options={{
                        tabBarLabel: "Profile",
                        tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account" color={color} size={26} />,
                      }}
                    />
                    <Tab.Screen
                      name="Map"
                      options={{
                        tabBarLabel: "Map",
                        tabBarIcon: ({ color }) => <MaterialCommunityIcons name="map" color={color} size={26} />,
                      }}
                    >
                      {(props) => (
                        <MapScreen
                          {...props}
                          token={token}
                          places={places}
                          setPlaces={setPlaces}
                          filteredLocations={filteredLocations}
                          setFilteredLocations={setFilteredLocations}
                          bottomSheetRef={bottomSheetRef}
                          handleMapItemDeselect={handleMapItemDeselect}
                          selectedMapItem={selectedMapItem}
                          handleMarkerPress={handleMarkerPress}
                          mapRef={mapRef}
                          collapseBottomSheet={collapseBottomSheet}
                          handleListItemPress={handleListItemPress}
                        />
                      )}
                    </Tab.Screen>
                  </Tab.Navigator>
                )}
              </Stack.Screen>
              <Stack.Screen name="AddEventScreen" component={AddEventScreen} options={{ title: "Add Event" }} />
              <Stack.Screen name="EventScreen" component={EventScreen} options={{ title: "Event" }} />
              <Stack.Screen name="EditEventScreen" component={EditEventScreen} options={{ title: "Edit Event" }} />
              <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} options={{ title: "Edit Profile" }} />
              <Stack.Screen name="SettingsScreen" component={SettingsScreen} options={{ title: "Settings" }} />
              <Stack.Screen name="MessageScreen" component={MessageScreen} options={{ title: "My Comments" }} />
            </Stack.Navigator>
          </NavigationContainer>
        </EventProvider>
      </PaperProvider>
    </themeContext.Provider>
  ) : (
    <AuthStack />
  );
}
