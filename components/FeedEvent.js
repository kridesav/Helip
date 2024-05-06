import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { Card, Button, Text, Badge, Icon } from "react-native-paper";
import { useRealTimeEventComments } from "../hooks/comments/useFetchCommentsRealTime";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getSportIcon } from "./getIcons";
import { LayoutAnimation, UIManager, Platform } from "react-native";

const FeedEvent = ({
  userId,
  isJoining,
  isFull,
  navigation,
  userLocation,
  event,
  expandedId,
  calculateDistance,
  handleJoinEvent,
  toggleExpansion,
  joined,
  handleCancelJoinEvent
}) => {
  const [newCommentCount, setNewCommentCount] = useState(0);
  const { comments } = userId ? useRealTimeEventComments(event.id, userId) : "";

  const isFocused = useIsFocused();

  const checkIfEventHasNewComments = (lastChecked) => {
    let newComments = 0;
    comments.map(function (comment) {
      comment.updatedAt.seconds > lastChecked + 2 ? newComments++ : "";
      comment.replies.map((reply) => (reply.updatedAt.seconds > lastChecked ? newComments++ : ""));
    });

    setNewCommentCount(newComments);
  };

  if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const configureAnimation = () => {
    LayoutAnimation.configureNext({
      duration: 200,
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      delete: {
        duration: 200,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      create: {
        duration: 300,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    });
  };

  const toggleExpansionFunc = (id) => {
    configureAnimation();
    toggleExpansion(id);
  };

  const initLastChecked = async () => {
    try {
      await AsyncStorage.setItem(`@CommentsChecked:${userId}:${event.id}`, `0`);
    } catch (error) {
      console.log("Error storing comments to async storage");
    }
  };

  const retrieveCommentsChecked = async (length) => {
    if (length > 0) {
      try {
        const value = await AsyncStorage.getItem(`@CommentsChecked:${userId}:${event.id}`);
        if (value !== null) {
          checkIfEventHasNewComments(value);
        } else {
          initLastChecked();
        }
      } catch (error) {
        console.log("Error retrieving comments from async storage");
      }
    }
  };

  useEffect(() => {
    comments ? retrieveCommentsChecked(comments.length) : "";
  }, [comments, isFocused]);

  return (
    <Card key={event.id} style={styles.card} onPress={() => toggleExpansionFunc(event.id)}>
      <Badge visible={newCommentCount > 0 ? true : false} style={styles.badge} size={20}>
        {newCommentCount}
      </Badge>
      {!joined ?
      <Badge visible={event.userJoined} style={styles.badgeJoined}>
        <Icon mode="text" source="check" />
        <Text variant="labelMedium">Joined </Text>
      </Badge>
      :''
      }
      <View style={styles.cardLayout}>
        <View style={styles.imageContainer}>
          <Card.Cover source={getSportIcon(event.typeName)} style={styles.cover} />
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
            <Text>
              Time: {event.StartTime} - {event.EndTime}
            </Text>

            <Text>Location: {event.locationName}</Text>
          </Card.Content>
          <Card.Actions style={{ justifyContent: "space-between", paddingTop: 10 }}>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate("EventScreen", { event: {...event, eventDate: event.eventDate.toISOString()} })}
              style={[styles.button, event.isFull ? dynamicStyles.fullButton : {}]}
            >
              Details
            </Button>
            {event.userJoined ?
              <Button mode="contained" onPress={() => handleCancelJoinEvent(event.id)} >
                Leave
              </Button>
              :
              <Button mode="contained" onPress={() => handleJoinEvent(event.id)}>
                Join
              </Button>
            }
            
          </Card.Actions>
        </>
      )}
    </Card>
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
  badge: {
    position: "absolute",
    top: 4,
    left: 4,
  },
  badgeJoined: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "green",
  },
});

export default FeedEvent;
