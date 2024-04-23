import React, { useContext, useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert, Pressable } from "react-native";
import { useTheme, Text, Surface, Button } from "react-native-paper";
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
    const [joinedEventIds, setJoinedEventIds] = useState([]);
    const [createdEventIds, setCreatedEventIds] = useState([]);
    const [showEvents, setShowEvents] = useState([true,false])

    useEffect(() => {
        const updatedEventIds = eventIds
          .map((event) => ({
            ...event,
            userJoined: event.usersParticipating.includes(currentUser?.uid),
          }))
        const filterCreated =  updatedEventIds.filter((event) => event.createdBy === currentUser?.uid);
        const filterJoined = updatedEventIds.filter((event) => event.userJoined);
        setCreatedEventIds(filterCreated);
        setJoinedEventIds(filterJoined);
    }, [eventIds, currentUser?.uid]);
        
    const toggleExpansion = (id) => {
        console.log(id)
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
        <Surface style={styles.container} elevation={1}>   
                <ScrollView style={{ flex: 1, paddingTop: 75 }}>
                    <View style={styles.buttonContainer}>
                        <Button mode="outlined" compact style={[styles.button, showEvents[0] && { borderWidth: 2, }]} onPress={() => setShowEvents([!showEvents[0],false])}>Created</Button>
                        <Button mode="outlined" compact style={[styles.button, showEvents[1] && { borderWidth: 2 }]} onPress={() => setShowEvents([false,!showEvents[1]])}>Joined</Button>
                    </View>
                    {createdEventIds.length > 0 && showEvents[0] ? 
                    (
                        createdEventIds.map((event) => (
                        <FeedEvent key={event.id} userId={currentUser?.uid} navigation={navigation} isJoining={isJoining} event={event} userLocation={userLocation} expandedId={expandedId} toggleExpansion={toggleExpansion} calculateDistance={calculateDistance} handleJoinEvent={handleJoinEvent} />
                        ))
                    ) : ''
                    }
                    {joinedEventIds.length > 0 && showEvents[1] ? 
                    (
                        joinedEventIds.map((event) => (
                        <FeedEvent key={event.id} userId={currentUser?.uid} navigation={navigation} isJoining={isJoining} event={event} userLocation={userLocation} expandedId={expandedId} toggleExpansion={toggleExpansion} calculateDistance={calculateDistance} handleJoinEvent={handleJoinEvent} />
                        ))
                    ) : ''
                    }
                    <Text style={{marginBottom:50}}></Text>
                </ScrollView>         
        </Surface>
    )
}

const styles = StyleSheet.create({
    button : {
        width: '45%',
        marginBottom: 8,
        height:45,
        textAlign: 'center'
    },
    container: {
        flex: 1
    },
    buttonContainer:{
        flex: 1,
        flexDirection: 'row',
        width: '70%',
        alignSelf: 'center',
        justifyContent: 'space-around'
    }
  });

export default MyEvents