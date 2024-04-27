import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Button, Surface, useTheme, Text, HelperText, Avatar, Card } from "react-native-paper";
import { useIsEventCreator } from "../../hooks/events/useIsEventCreator";
import { useIfUserJoined } from "../../hooks/useIfUserJoined";
import CancelJoinEvent from "../../hooks/events/utils/cancelJoinEvent";
import useAuth from "../../hooks/useAuth";
import { useFocusEffect } from "@react-navigation/native";
import { fetchEventById } from "../../hooks/events/utils/fetchEventById";
import joinEvent from "../../hooks/events/utils/joinEvent";
import { useRealTimeEvent } from "../../hooks/events/useEventRealTimeDetails";
import { useRealTimeEventComments } from "../../hooks/comments/useFetchCommentsRealTime";
import { CommentsDialog, CommentsContainer } from "../../components/Comments";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Userlist from "../../components/Userlist";
import usefetchUserData from "../../hooks/usefetchUsersByEventId";
import usefetchCreatorData from "../../hooks/useFetchCreatorData";
import LoadingIndicator from "../../components/Loading"

const EventScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const route = useRoute();
  const { event: initialEvent } = route.params;
  const [event, setEvent] = useState(initialEvent);

  const { currentUser } = useAuth();

  const userId = currentUser?.uid;
  const { eventData } = useRealTimeEvent(initialEvent.id, currentUser);

  const isCreator = useIsEventCreator(event.createdBy);

  const [hasJoined, setHasJoined] = useState(false);
  const isUser = useIfUserJoined(event.usersParticipating);
  const [isJoining, setIsJoining] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  const { comments } = useRealTimeEventComments(event.id, userId);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [show, setShow] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [participants, setParticipants] = useState([]);
  const { users, loading } = usefetchUserData(event.usersParticipating);
  const { userData, loadingUserData } = usefetchCreatorData(event.createdBy);

  const saveCommentsChacked = async () => {
    try {
      await AsyncStorage.setItem(`@CommentsChecked:${userId}:${event.id}`, `${new Date().getTime() / 1000}`);
    } catch (error) {
      console.log("Error storing comments to async storage");
    }
  };

  useEffect(() => {
    if (userId && event.id) {
      console.log("ran");
      saveCommentsChacked();
    }
  }, [userId]);

  useEffect(() => {
    setHasJoined(isUser);
  }, [isUser]);

  const handleJoinPress = () => {
    Alert.alert("Confirm", "Are you sure you want to join this event?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: () => {
          JoinToEventFirestore();
        },
      },
    ]);
  };

  const handleCancelJoinPress = () => {
    Alert.alert("Confirm", "Are you sure you want to cancel the join in this event?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: () => {
          CancelJoinToEventFirestore();
        },
      },
    ]);
  };

  const JoinToEventFirestore = async () => {
    if (!userId) {
      Alert.alert("Error", "You must be logged in to join an event.");
      return;
    }

    setIsJoining(true);
    try {
      const success = await joinEvent(event.id, userId);

      if (success) {
        setHasJoined(true);
        Alert.alert("Success", "You joined the event successfully", [{ text: "OK", onPress: () => fetchLatestEventDetails() }]);
      } else {
        Alert.alert("Error", "Failed to join event or update UI.");
      }
    } catch (error) {
      console.error("Error during event join operation:", error);
      Alert.alert("Error", "An error occurred while trying to join the event.");
    } finally {
      setIsJoining(false);
    }
  };

  const CancelJoinToEventFirestore = async () => {
    if (!userId) {
      Alert.alert("Error", "You must be logged in to join an event.");
      return;
    }
    setIsCanceling(true);
    try {
      const success = await CancelJoinEvent(event.id, userId);
      if (success) {
        setHasJoined(false);
        Alert.alert("Success", "You canceled your participation in the event", [{ text: "OK", onPress: () => fetchLatestEventDetails() }]);
      } else {
        Alert.alert("Error", "Failed to cancel your participation in event or update UI.");
      }
    } catch (error) {
      console.error("Error during event join opeshile trying to join the event.");
    } finally {
      setIsCanceling(false);
    }
  };

  const fetchLatestEventDetails = async () => {
    if (!initialEvent || !initialEvent.id) {
      console.log("Initial event or event ID is undefined.");
      return;
    }

    const latestEventData = await fetchEventById(initialEvent.id);
    if (latestEventData) {
      setEvent(latestEventData);
    } else {
      console.log("Failed to fetch latest event data or event does not exist.");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchLatestEventDetails();
    }, [initialEvent.id])
  );

  if (!eventData) {
    return <Text>Event not found or has been removed.</Text>;
  }

  const styles = StyleSheet.create({
    bottomlist: {
      width: "100%",
      marginTop: 15,
      borderRadius: 10,
      padding: 10,
      paddingBottom: 20,
      marginBottom: 20,
    },
    title: {
      padding: 10,
      textAlign: "center",
      fontSize: 18,
      color: colors.primary,
      fontWeight: "bold",
    },
    creatorCardTitle: {
      color: colors.primary,

    },
    container: {
      alignItems: "center",
      padding: 5,
    },
    detailContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
      marginTop: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 10,
    },

    detailText: {
      marginLeft: 10,
      color: colors.secondary,
      fontSize: 15,
    },
    fullEventText: {
      color: colors.error,
      textAlign: "center",
      alignItems: "center",
      marginTop: 10,
      padding: 10,
      fontSize: 20,
    },

    portal: {
      padding: 10,
    },
    buttons: {
      flexDirection: "column",
      justifyContent: "space-around",
    },

    control: {
      margin: 10,
    },
    cardLayout: {
      flexDirection: "row",
      alignItems: "center",
    },
    imageContainer: {
      width: 64,
      height: 64,
      marginHorizontal: 10,
      borderRadius: 100,
      overflow: "hidden",

    },
    loadingContainer: {
      width: 200,
      height: 84,
      marginHorizontal: 75,
      borderRadius: 100,
      overflow: "hidden",

    },
  });

  const handleShowParticipants = () => {
    setParticipants(users);
    setModalVisible(true);
  };



  return (
    <Surface style={{ backgroundColor: colors.inversePrimary }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Surface style={styles.bottomlist} elevation={1}>
          <Surface elevation={2} style={{ borderRadius: 10, padding: 10 }}>
            <Text style={styles.title}>
              {eventData.title} at {eventData.locationName}
            </Text>

            <TouchableOpacity style={{ marginBottom: 10 }}>
              <Card style={{ marginTop: 10 }}>
                {loadingUserData ? (
                  <View style={styles.loadingContainer}>
                    <LoadingIndicator />
                  </View>
                ) : (
                  <View style={styles.cardLayout}>
                    <View style={styles.imageContainer}>
                      <Avatar.Image
                        source={{ uri: `https://api.multiavatar.com/${userData?.profilePictureUrl || userData?.displayName}.png` }}
                        style={styles.cover}
                      />
                    </View>
                    <Card.Content>
                      <Text variant="bodyLarge" style={styles.creatorCardTitle}>
                        Created by: {userData?.displayName ? userData.displayName : (userData?.firstName ? userData.firstName : "no name")}
                      </Text>
                    </Card.Content>
                  </View>
                )}
              </Card>
            </TouchableOpacity>
          </Surface>
          <Surface style={styles.bottomlist} elevation={2}>
            <View style={styles.detailContainer}>
              <Icon name="calendar" size={20} style={{ color: colors.primary }} />
              <Text style={styles.detailText}>{eventData.date}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Icon name="clock-start" size={20} style={{ color: colors.primary }} />
              <Text style={styles.detailText}>{eventData.StartTime}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Icon name="clock-end" size={20} style={{ color: colors.primary }} />
              <Text style={styles.detailText}>{eventData.EndTime}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Icon name="information" size={20} style={{ color: colors.primary }} />
              <Text style={styles.detailText}>{eventData.description}</Text>
            </View>
            <TouchableOpacity onPress={handleShowParticipants} disabled={loading}>
              <Surface style={[styles.detailContainer, { backgroundColor: loading ? colors.inversePrimary : colors.activeBackground }]} elevation={5}>
                <Icon name="account-multiple-plus" size={20} style={{ color: loading ? colors.inactiveIcon : colors.primary }} />
                <Text variant="labelMedium" style={[styles.detailText, (style = { color: loading ? colors.secondary : colors.secondary })]}>
                  {eventData.participants}/{eventData.participantLimit} participants
                </Text>
              </Surface>
            </TouchableOpacity>

            <Userlist users={participants} modalVisible={modalVisible} setModalVisible={setModalVisible} />
          </Surface>
          <View style={styles.buttons}>
            {isCreator && (
              <Button
                icon="check-circle"
                mode="contained-tonal"
                title="Edit"
                style={[styles.control, styles.editButton]}
                onPress={() => navigation.navigate("EditEventScreen", { event })}
              >
                Edit
              </Button>
            )}
            {hasJoined ? (
              <>
                <Button
                  icon="cancel"
                  mode="elevated"
                  title="Cancel Join"
                  style={[styles.control, isCreator && styles.nextToEditButton]}
                  onPress={handleCancelJoinPress}
                  disabled={isCanceling}
                >
                  {isJoining ? <ActivityIndicator /> : "Cancel Join"}
                </Button>
                {eventData.isFull && <HelperText style={styles.fullEventText}>Event Full</HelperText>}
              </>
            ) : eventData.isFull ? (
              <HelperText style={styles.fullEventText}>Event Full</HelperText>
            ) : (
              <Button
                title="Join"
                icon="check-circle"
                mode="elevated"
                style={[styles.control, isCreator && styles.nextToEditButton]}
                onPress={handleJoinPress}
                disabled={isJoining}
              >
                {isJoining ? <ActivityIndicator /> : "Join"}
              </Button>
            )}
          </View>
        </Surface>

        <View style={styles.portal}>
          <Button title="Comment" icon="comment" mode="elevated" onPress={() => setDialogVisible(true)}>
            Add Comment
          </Button>
          <CommentsContainer
            comments={comments}
            eventId={initialEvent.id}
            show={show}
            setShow={setShow}
            setDialogVisible={setDialogVisible}
            currentUser={currentUser}
          />
          <CommentsDialog
            visible={dialogVisible}
            setDialogVisible={setDialogVisible}
            eventId={initialEvent.id}
            onDismiss={() => setDialogVisible(false)}
          />
        </View>
      </ScrollView>
    </Surface>
  );
};

export default EventScreen;
