import React, { useState } from "react";
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button, PaperProvider } from "react-native-paper"
import { useTheme } from 'react-native-paper';
import { useIsEventCreator } from '../../hooks/events/useIsEventCreator';
import theme from '../../theme';

import { useFocusEffect } from '@react-navigation/native';
import {fetchEventById} from '../../hooks/events/useFetchEventById'


const EventScreen = () => {

    const navigation = useNavigation();
    const { colors } = useTheme();
    const route = useRoute();
    const { event: initialEvent } = route.params;
    const [event, setEvent] = useState(initialEvent);


    const isCreator = useIsEventCreator(event.createdBy);

    const handleJoinPress = () => {
        console.log("navigate")
    };

    useFocusEffect(
        React.useCallback(() => {
            if (!initialEvent || !initialEvent.id) {
                console.log("Initial event or event ID is undefined.");
                return;
            }

            const fetchLatestEventDetails = async () => {
                const latestEventData = await fetchEventById(initialEvent.id);
                if (latestEventData) {
                    setEvent(latestEventData);
                } else {
                    console.log("Failed to fetch latest event data or event does not exist.");
                }
            };

            fetchLatestEventDetails();
        }, [initialEvent])
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
                        <Button icon="check-circle" mode="elevated" title="Edit" style={styles.control} onPress={() => navigation.navigate('EditEventScreen', { event })}>Edit</Button>
                    ) : (
                        <Button title="Join" icon="check-circle" mode="elevated" style={styles.control} onPress={handleJoinPress}>Join</Button>
                    )}
                    <Button icon="close-circle" mode="elevated" title="Cancel" style={styles.control} onPress={() => navigation.goBack()}>Cancel</Button>
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
    control: {
        marginTop: 20,
    },
    header: {
        fontSize: 16,
        fontWeight: "bold",
    }
});



export default EventScreen;