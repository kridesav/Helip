import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Card, Button, Text, Badge } from "react-native-paper";
import { useRealTimeEventComments } from "../hooks/comments/useFetchCommentsRealTime";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FeedEvent = ({ userId ,isJoining, navigation, userLocation, event, expandedId, calculateDistance, handleJoinEvent, toggleExpansion}) => {
    
  const [newCommentCount, setNewCommentCount] = useState(0);
  const { comments } = useRealTimeEventComments(event.id, userId);

  const checkIfEventHasNewComments = (lastChecked) => {
    let newComments = 0
    comments.map(function(comment){
      comment.updatedAt.seconds > lastChecked + 2 ? newComments++ : ''
      comment.replies.map(reply => reply.updatedAt.seconds > lastChecked ? newComments++ : '' )
    })
    setNewCommentCount(newComments)
  }

  const saveCommentsChecked = async () => {
    try {
      await AsyncStorage.setItem(
        `@CommentsChecked:${userId}:${event.id}`,
        `${new Date().getTime() / 1000}`,
      );
    } catch (error) {
      console.log('Error storing comments to async storage')
    }
  };

  const retrieveCommentsChecked = async (length) => {
    if(length > 0){
      try {
        const value = await AsyncStorage.getItem(`@CommentsChecked:${userId}:${event.id}`);
        if (value !== null) {
          checkIfEventHasNewComments(value)
        } 
      } catch (error) {
        console.log('Error retrieving comments from async storage')
      }
    }
  };

  useEffect(() => {
    retrieveCommentsChecked(comments.length)
  }, [comments])


  const handleDetailsButtonClick = () => {
    saveCommentsChecked()
    navigation.navigate("EventScreen", { event })
  }

  return(
    <Card key={event.id} style={styles.card} onPress={() => toggleExpansion(event.id)}>
      <Badge visible={newCommentCount > 0 ? true : false} style={styles.badge} size={20}>{newCommentCount}</Badge>
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
                onPress={handleDetailsButtonClick}
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
    badge: {
      position: 'absolute',
      top: 4,
      left: 4,
    },
  });

export default FeedEvent