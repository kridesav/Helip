import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, Alert, ActivityIndicator } from "react-native";
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
import { useRealTimeEvent } from '../../hooks/events/useEventRealTimeDetails';

const EventScreen = () => {

    const navigation = useNavigation();
    const { colors } = useTheme();
    const route = useRoute();
    const { event: initialEvent } = route.params;
    const [event, setEvent] = useState(initialEvent);

    const { currentUser } = useAuth();
    const userId = currentUser?.uid;
    const { eventData } = useRealTimeEvent(initialEvent.id);

    const isCreator = useIsEventCreator(event.createdBy);

    const [hasJoined, setHasJoined] = useState(false);
    const isUser = useIfUserJoined(event.usersParticipating)

    const [isJoining, setIsJoining] = useState(false);
    const [isCanceling, setIsCanceling] = useState(false);

    useEffect(() => {
        setHasJoined(isUser);
    }, [isUser]);

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

        setIsJoining(true);
        try {
            const success = await joinEvent(event.id, userId);

            if (success) {
                setHasJoined(true);
                Alert.alert("Success", "You joined the event successfully", [
                    { text: "OK", onPress: () => fetchLatestEventDetails() },
                ]);
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
                Alert.alert("Success", "You canceled your participation in the event", [
                    { text: "OK", onPress: () => fetchLatestEventDetails() }
                ]);
            } else {
                Alert.alert("Error", "Failed to join event or update UI.");
            }
        } catch (error) {
            console.error("Error during event join operation:", error);
            Alert.alert("Error", "An error occurred while trying to join the event.");
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


    return (
        <PaperProvider theme={theme}>

            <ScrollView contentContainerStyle={styles.container} >
                <View style={styles.detailContainer}>
                    <Text style={styles.header}> {eventData.title} at {eventData.locationName}</Text>
                </View>
                <View style={styles.detailContainer}>
                    <Icon name="calendar" size={20} />
                    <Text style={styles.detailText}>{eventData.date}</Text>
                </View>

                <View style={styles.detailContainer}>
                    <Icon name="clock-start" size={20} />
                    <Text style={styles.detailText}>{eventData.StartTime}</Text>
                </View>

                <View style={styles.detailContainer}>
                    <Icon name="clock-end" size={20} />
                    <Text style={styles.detailText}>{eventData.EndTime}</Text>
                </View>
                <View style={styles.detailContainer}>
                    <Icon name="information" size={20} />
                    <Text style={styles.detailText}>{eventData.description}</Text>
                </View>
                <View style={styles.detailContainer}>
                    <Icon name="account-multiple-plus" size={20} />
                    <Text style={styles.detailText}>{eventData.participants}/{eventData.participantLimit} participants</Text>
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
                    ) : hasJoined ? (
                        <>
                            <Button
                                icon="cancel"
                                mode="elevated"
                                title="Cancel Join"
                                style={styles.control}
                                onPress={handleCancelJoinPress}
                                disabled={isCanceling}
                            >
                                {isJoining ? <ActivityIndicator /> : "Cancel Join"}
                            </Button>
                            {eventData.isFull && <Text style={styles.fullEventText}>Event Full</Text>}
                        </>
                    ) : eventData.isFull ? (
                        <Text style={styles.fullEventText}>Event Full</Text>


                    ) : (
                        <Button
                            title="Join"
                            icon="check-circle"
                            mode="elevated"
                            style={styles.control}
                            onPress={handleJoinPress}
                            disabled={isJoining || isUser}
                        >
                            {isJoining ? <ActivityIndicator /> : "Join"}
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