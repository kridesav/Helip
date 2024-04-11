import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Button, Text } from "react-native-paper";

const FeedEvent = ({ isJoining, navigation, userLocation, event, expandedId, calculateDistance, handleJoinEvent, toggleExpansion}) => {
    return(
        <Card key={event.id} style={styles.card} onPress={() => toggleExpansion(event.id)}>
            <View style={styles.cardLayout}>
              <View style={styles.imageContainer}>
                <Card.Cover /* source={"joku image"} */ style={styles.cover} />
              </View>

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
    )
}

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
  });

export default FeedEvent