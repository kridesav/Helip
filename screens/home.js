import React, { useContext, useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { useTheme, Text, SegmentedButtons } from "react-native-paper";
import { EventContext } from "../context/EventProvider";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import joinEvent from "../hooks/events/utils/joinEvent";
import * as Location from "expo-location";
import FeedEvent from "../components/FeedEvent";
import { LayoutAnimation, UIManager, Platform } from "react-native";

const HomeScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const eventIds = useContext(EventContext);
  const { currentUser } = useAuth();
  const [userLocation, setUserLocation] = useState(null);

  const [expandedId, setExpandedId] = useState(null);
  const [isJoining, setIsJoining] = useState(false);
  const [joinedEventId, setJoinedEventId] = useState(null);
  const [filteredEventIds, setFilteredEventIds] = useState([]);
  const [sortType, setSortType] = useState("date");

  if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  useEffect(() => {
    LayoutAnimation.configureNext({
      duration: 500,
      update: { type: "spring", springDamping: 1 },
      create: { duration: 100, type: "easeIn", property: "opacity" },
      delete: { duration: 200, type: "linear", property: "opacity" },
    });
  }, [sortType, filteredEventIds]);

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

  useEffect(() => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (currentUser?.uid && eventIds && userLocation) {
      const processedEvents = eventIds
        .map((event) => ({
          ...event,
          userJoined: event.usersParticipating.includes(currentUser.uid),
          distance: event.coordinates
            ? calculateDistance(userLocation.latitude, userLocation.longitude, event.coordinates[1], event.coordinates[0])
            : Infinity,
        }))
        .filter((event) => {
          const eventDate = parseDate(event.date);
          return event.createdBy !== currentUser.uid && eventDate >= currentDate;
        });

      const sortedEvents = sortEvents(processedEvents, sortType);
      setFilteredEventIds(sortedEvents);
    }
  }, [eventIds, currentUser, userLocation, sortType]);

  const toggleExpansion = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return new Date(0);
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return new Date(0);
  };

  const sortEvents = (events, type) => {
    switch (type) {
      case "date":
        return [...events].sort((a, b) => parseDate(a.date) - parseDate(b.date));
      case "sport":
        return [...events].sort((a, b) => (a.typeName || "").localeCompare(b.typeName || ""));
      case "distance":
        return [...events].sort((a, b) => a.distance - b.distance);
      default:
        return events;
    }
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

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, paddingTop: 75 }}>
      <SegmentedButtons
        value={sortType}
        onValueChange={setSortType}
        style={{ marginHorizontal: 16, marginBottom: 35 }}
        buttons={[
          { value: "date", label: "Date" },
          { value: "sport", label: "Sport Type" },
          { value: "distance", label: "Distance" },
        ]}
      />

      {filteredEventIds.length > 0 ? (
        filteredEventIds.map((event) => (
          <FeedEvent
            key={event.id}
            navigation={navigation}
            isJoining={isJoining}
            event={event}
            userLocation={userLocation}
            expandedId={expandedId}
            toggleExpansion={toggleExpansion}
            calculateDistance={calculateDistance}
            handleJoinEvent={handleJoinEvent}
            isFull={event.participants >= event.participantLimit}
          />
        ))
      ) : (
        <View style={styles.centered}>
          <Text>No events for this location.</Text>
        </View>
      )}
      <Text style={{ marginBottom: 100 }}></Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
