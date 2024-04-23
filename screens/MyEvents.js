import React, { useContext, useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { useTheme, Text, SegmentedButtons, Switch } from "react-native-paper";
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
  const [currentTab, setCurrentTab] = useState("created");
  const [showPastEvents, setShowPastEvents] = useState(false);

  useEffect(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    console.log("Current filter time:", now);

    const updatedEventIds = eventIds
      .map((event) => ({
        ...event,
        userJoined: event.usersParticipating.includes(currentUser?.uid),
        eventDate: parseDate(event.date),
      }))
      .filter((event) => event.createdBy === currentUser?.uid || event.userJoined);

    console.log("Events after initial filter:", updatedEventIds.length);

    const filteredEvents = updatedEventIds.filter((event) => showPastEvents || event.eventDate >= now);

    console.log("Events after date filter:", filteredEvents.length);

    setCreatedEventIds(filteredEvents.filter((event) => event.createdBy === currentUser?.uid));
    setJoinedEventIds(filteredEvents.filter((event) => event.userJoined));
  }, [eventIds, currentUser?.uid, showPastEvents]);

  function parseDate(dateStr) {
    if (!dateStr) return new Date(0);
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const [day, month, year] = parts.map((num) => parseInt(num, 10));
      return new Date(year, month - 1, day);
    }
    return new Date(0);
  }

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

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1, paddingTop: 75 }}>
        <SegmentedButtons
          value={currentTab}
          onValueChange={setCurrentTab}
          style={{ marginHorizontal: 16, marginBottom: 16 }}
          buttons={[
            { value: "created", label: "Created Events" },
            { value: "joined", label: "Joined Events" },
          ]}
        />
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginHorizontal: 16, marginBottom: 16 }}>
          <Text style={{ marginRight: 10 }}>Show Past Events</Text>
          <Switch value={showPastEvents} onValueChange={() => setShowPastEvents(!showPastEvents)} color={colors.primary} />
        </View>
        {createdEventIds.length > 0 && currentTab === "created"
          ? createdEventIds.map((event) => (
              <FeedEvent
                key={event.id}
                userId={currentUser?.uid}
                navigation={navigation}
                isJoining={isJoining}
                event={event}
                userLocation={userLocation}
                expandedId={expandedId}
                toggleExpansion={toggleExpansion}
                calculateDistance={calculateDistance}
                handleJoinEvent={handleJoinEvent}
              />
            ))
          : ""}
        {joinedEventIds.length > 0 && currentTab === "joined"
          ? joinedEventIds.map((event) => (
              <FeedEvent
                key={event.id}
                userId={currentUser?.uid}
                navigation={navigation}
                isJoining={isJoining}
                event={event}
                userLocation={userLocation}
                expandedId={expandedId}
                toggleExpansion={toggleExpansion}
                calculateDistance={calculateDistance}
                handleJoinEvent={handleJoinEvent}
              />
            ))
          : ""}
        <Text style={{ marginBottom: 100 }}></Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "white",
    height: 45,
  },
  container: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
  },
});

export default MyEvents;
