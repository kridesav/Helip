import React, { useContext, useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { useTheme, Text } from "react-native-paper";
import { EventContext } from "../context/EventProvider";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import joinEvent from "../hooks/events/utils/joinEvent";
import * as Location from "expo-location";
import FeedEvent from "../components/FeedEvent";


const MyEvents = () => {

    const { colors } = useTheme();
    const navigation = useNavigation();
    const eventIds = useContext(EventContext);
    const { currentUser } = useAuth();
    const [userLocation, setUserLocation] = useState(null);
  
    const [expandedId, setExpandedId] = useState(null);
    const [isJoining, setIsJoining] = useState(false);
    const [joinedEventId, setJoinedEventId] = useState(null);
    const [filteredEventIds, setFilteredEventIds] = useState([]);

    useEffect(() => {
        const updatedEventIds = eventIds
          .map((event) => ({
            ...event,
            userJoined: event.usersParticipating.includes(currentUser?.uid),
          }))
          .filter((event) => event.createdBy === currentUser?.uid);
    
        setFilteredEventIds(updatedEventIds);
    }, [eventIds, currentUser?.uid]);
        
    const toggleExpansion = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
            console.error("Permission to access location was denied");
            return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setUserLocation(location.coords);
        })();
        }, []);

        const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const toRad = (x) => (x * Math.PI) / 180;
        const R = 6371;

        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    };

    const handleJoinEvent = async (eventId) => {
        if (!currentUser) {
            Alert.alert("Error", "You must be logged in to join an event.");
            return;
    }

    setIsJoining(true);
        try {
            const success = await joinEvent(eventId, currentUser.uid);
            if (success) {
            Alert.alert("Joined", "You have successfully joined the event.");
            setJoinedEventId(eventId);
            } else {
            Alert.alert("Error", "Could not join the event.");
            }
        } catch (error) {
            console.error("Join event error:", error);
            Alert.alert("Error", "An error occurred while trying to join the event.");
        } finally {
            setIsJoining(false);
        }
    }; 

    return(
        <ScrollView style={{ flex: 1, backgroundColor: colors.tertiary, paddingTop: 75 }}>
            {filteredEventIds.length > 0 ? (
                filteredEventIds.map((event) => (
                <FeedEvent navigation={navigation} isJoining={isJoining} event={event} userLocation={userLocation} expandedId={expandedId} toggleExpansion={toggleExpansion} calculateDistance={calculateDistance} handleJoinEvent={handleJoinEvent} />
                ))
            ) : (
                <View style={styles.centered}>
                <Text>No events for this location.</Text>
                </View>
            )}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });

export default MyEvents