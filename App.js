import * as React from "react";
import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import Maps from "./screens/map";
import { StyleSheet, Text, View, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import BottomSheetComponent from "./components/BottomSheetComponent";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AuthStack from "./screens/login/authStack";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./config/firebaseConfig";

//placeholder
function HomeScreen() {
  return (
    <GestureHandlerRootView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home!</Text>
      <BottomSheetComponent />
    </GestureHandlerRootView>
  );
}

//placeholder
function ProfileScreen() {
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log("User logged out");
      })
      .catch((error) => {
        // An error happened.
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

function MapScreen() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Maps />
      <BottomSheetComponent />
    </GestureHandlerRootView>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  const [user, setUser] = useState("");

  useEffect(() => {
    const unsubscribeFromAuthStatusChanged = onAuthStateChanged(auth, (user) => {
      user ? setUser(user) : setUser(null);
      return unsubscribeFromAuthStatusChanged;
    });
  }, []);

  console.log(user);

  return user ? (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Map">
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Map" component={MapScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  ) : (
    <AuthStack />
  );
}
