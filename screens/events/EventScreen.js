import React, { useState } from "react";
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, PaperProvider } from "react-native-paper"
import { useTheme } from 'react-native-paper';
import { useIsEventCreator } from '../../hooks/events/useIsEventCreator';
import { useIfUserJoined } from "../../hooks/useIfUserJoined";
import CancelJoinEvent from '../../hooks/events/utils/cancelJoinEvent'
import theme from '../../theme';
import useAuth from '../../hooks/useAuth';
import { useFocusEffect } from '@react-navigation/native';
import { fetchEventById } from '../../hooks/events/utils/fetchEventById'
import joinEvent from '../../hooks/events/utils/joinEvent'
import useEventDetails from "../../hooks/events/useEventDetails";


const EventScreen = () => {

    const navigation = useNavigation();
    const { colors } = useTheme();
    const route = useRoute();
    const { event: initialEvent } = route.params;
    const [event, setEvent] = useState(initialEvent);
    const { currentUser } = useAuth();
    const userId = currentUser?.uid;

    const isCreator = useIsEventCreator(event.createdBy);
    const isUser = useIfUserJoined(event.usersParticipating)
    const { isEventFull } = useEventDetails(initialEvent.id);

    const handleJoinPress = () => {

        Alert.alert(
            "Confirm",
            "Are you sure you want to join this event?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Yes", onPress: () => {
                        JoinToEventFirestore();
                    }
                }
            ]
        );
    };


    const handleCancelJoinPress = () => {

        Alert.alert(
            "Confirm",
            "Are you sure you want to cancel the join in this event?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Yes", onPress: () => {
                        CancelJoinToEventFirestore();
                    }
                }
            ]
        );
    };


    const JoinToEventFirestore = async () => {
        if (!userId) {
            Alert.alert("Error", "You must be logged in to join an event.");
            return;
        }

        const success = await joinEvent(event.id, userId);
        if (success) {
            console.log("You joined event successfully", [
                { text: "OK", onPress: () => fetchLatestEventDetails() }
            ]);
        } else {
            console.error("Failed to join event or update UI.");
        }
    };

    const CancelJoinToEventFirestore = async () => {
        if (!userId) {
            Alert.alert("Error", "You must be logged in to join an event.");
            return;
        }

        const success = await CancelJoinEvent(event.id, userId);

        if (success) {
            Alert.alert("Success", "You canceled your participation in the event", [
                { text: "OK", onPress: () => fetchLatestEventDetails() }
            ]);
        } else {
            Alert.alert("Error", "Failed to cancel participation to the event");
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


    return (
        <PaperProvider theme={theme}>
            <ScrollView contentContainerStyle={styles.container} >
                <View style={styles.detailContainer}>
                    <Text style={styles.header}> {event.title} at {event.locationName}</Text>
                </View>
                <View style={styles.detailContainer}>
                    <Icon name="calendar" size={20} />
                    <Text style={styles.detailText}>{event.date}</Text>
                </View>

                <View style={styles.detailContainer}>
                    <Icon name="clock-start" size={20} />
                    <Text style={styles.detailText}>{event.StartTime}</Text>
                </View>

                <View style={styles.detailContainer}>
                    <Icon name="clock-end" size={20} />
                    <Text style={styles.detailText}>{event.EndTime}</Text>
                </View>
                <View style={styles.detailContainer}>
                    <Icon name="information" size={20} />
                    <Text style={styles.detailText}>{event.description}</Text>
                </View>
                <View style={styles.detailContainer}>
                    <Icon name="account-multiple-plus" size={20} />
                    <Text style={styles.detailText}>{event.participants}/{event.participantLimit} participants</Text>
                </View>
                <View style={styles.buttons}>
                    {isCreator ? (
                        <Button
                            icon="check-circle"
                            mode="elevated"
                            title="Edit"
                            style={styles.control}
                            onPress={() => navigation.navigate('EditEventScreen', { event })}
                        >
                            Edit
                        </Button>
                    ) : isUser ? (
                        <>
                            <Button
                                icon="cancel"
                                mode="elevated"
                                title="Cancel Join"
                                style={styles.control}
                                onPress={handleCancelJoinPress}
                            >
                                Cancel Join
                            </Button>
                            {isEventFull && <Text style={styles.fullEventText}>Event Full</Text>}
                        </>
                    ) : isEventFull ? (
                        <Text style={styles.fullEventText}>Event Full</Text>


                    ) : (
                        <Button
                            title="Join"
                            icon="check-circle"
                            mode="elevated"
                            style={styles.control}
                            onPress={handleJoinPress}
                        >
                            Join
                        </Button>
                    )}
                </View>


            </ScrollView >
        </PaperProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    detailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 5,
    },
    detailText: {
        marginLeft: 10,
    },
    fullEventText: {
        textAlign: 'center',
        alignItems: 'center',
        marginTop: 10,
        padding: 10,
        fontSize: 20,
    },
    control: {
        marginTop: 20,
    },
    header: {
        fontSize: 16,
        fontWeight: "bold",
    }
});



export default EventScreen;