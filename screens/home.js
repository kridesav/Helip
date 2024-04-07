import React, { useContext, useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Card, Button, useTheme, Text } from "react-native-paper";
import { EventContext } from "../context/EventProvider";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import joinEvent from "../hooks/events/utils/joinEvent";
import * as Location from "expo-location";

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

  useEffect(() => {
    const updatedEventIds = eventIds
      .map((event) => ({
        ...event,
        userJoined: event.usersParticipating.includes(currentUser?.uid),
      }))
      .filter((event) => event.createdBy !== currentUser?.uid);

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

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.tertiary, paddingTop: 75 }}>
      {filteredEventIds.length > 0 ? (
        filteredEventIds.map((event) => (
          <Card key={event.id} style={styles.card} onPress={() => toggleExpansion(event.id)}>
            <View style={styles.cardLayout}>
              {/* Conditional rendering for the image */}
              <View style={styles.imageContainer}>
                <Card.Cover source={"joku image"} style={styles.cover} />
              </View>

              {/* Container for text details */}
              <View style={styles.textContainer}>
                <Text style={styles.title}>{event.title}</Text>
                <Text>Date: {event.date}</Text>
                <Text>
                  Distance:{" "}
                  {userLocation
                    ? `${calculateDistance(userLocation.latitude, userLocation.longitude, event.coordinates[1], event.coordinates[0]).toFixed(2)} km`
                    : "Distance not available"}
                </Text>
                <Text>
                  Slots: {event.participants}/{event.participantLimit}
                </Text>
              </View>
            </View>

            {expandedId === event.id && (
              <>
                <Card.Content style={{ marginTop: 10 }}>
                  <Text>Description: {event.description}</Text>
                  <Text>Location: {event.locationName}</Text>
                </Card.Content>
                <Card.Actions style={{ justifyContent: "space-between", paddingTop: 10 }}>
                  <Button
                    mode="outlined"
                    onPress={() => navigation.navigate("EventScreen", { event })}
                    style={[styles.button, event.isFull ? dynamicStyles.fullButton : {}]}
                  >
                    Details
                  </Button>
                  <Button mode="contained" onPress={() => handleJoinEvent(event.id)} disabled={event.userJoined || isJoining}>
                    {event.userJoined ? "Joined" : "Join"}
                  </Button>
                </Card.Actions>
              </>
            )}
          </Card>
        ))
      ) : (
        <View style={styles.centered}>
          <Text>No events for this location.</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    elevation: 4,
  },
  cardLayout: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageContainer: {
    width: 50,
    height: 50,
    marginHorizontal: 20,
    borderRadius: 100,
    overflow: "hidden",
  },
  cover: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontWeight: "bold",
  },
  fullButton: {
    backgroundColor: "grey",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HomeScreen;
