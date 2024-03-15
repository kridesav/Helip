import React, { useState } from "react";
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from '@react-navigation/native';
import { TextInput } from "react-native-paper";
import useAuth from '../../hooks/useAuth';
import DateTimePicker from '../../components/DateTimePicker';
import { Button } from "react-native-paper"
import { validateInput } from '../../utils/validateInput';
import formatTime from '../../utils/formatTime';
import formatDate from '../../utils/formatDate';
import { useTheme } from 'react-native-paper';
import editEvent from "../../hooks/events/utils/editEvent";
import deleteEvent from "../../hooks/events/utils/deleteEvent";
import { parseTime, parseDate } from '../../utils/parse'


const EditEventScreen = () => {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const route = useRoute();
    const { event } = route.params;

    const [value, setValue] = React.useState({
        title: event.title,
        description: event.description,
        participantLimit: event.participantLimit,
    });

    const [errors, setErrors] = useState({});

    const initialDate = parseDate(event.date);
    const initialStartTime = parseTime(event.StartTime, initialDate);
    const initialEndTime = parseTime(event.EndTime, initialDate);

    const [date, setDate] = useState(initialDate);
    const [StartTime, setStartTime] = useState(initialStartTime);
    const [EndTime, setEndTime] = useState(initialEndTime);

    const EditEvent = editEvent();
    const { currentUser } = useAuth();
    const userId = currentUser?.uid;

    const handleFormSubmit = () => {
        if (validateInput(value, setErrors)) {
            console.log('Input data:', value);

            Alert.alert(
                "Confirm",
                "Are you sure you want to modify this event?",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Yes", onPress: () => {
                            EditEventInFirestore();
                            setErrors({});

                        }
                    }
                ]
            );
        } else {
            console.log('Input validation failed');
        }
    };

    const handleDelete = () => {

        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this event?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Yes", onPress: () => {
                        DeleteEventInFirestore();
                        setErrors({});

                    }
                }
            ]
        );
       

    }

    const DeleteEventInFirestore = async () => {
       
        try {
            const success = await deleteEvent(event.id, userId);

            if (success) {
                console.log("Event successfully deleted!");
                navigation.navigate('Map');
            } else {
                console.log("Failed to delete the event");
            }
        } catch (error) {
            console.error("Failed to delete the event:", error);
            setErrors({ form: "Failed to delete the event. Please try again." });
          
        }

    };

    const EditEventInFirestore = async () => {
        const eventData = {
            title: value.title,
            description: value.description || '',
            date: formatDate(date),
            StartTime: formatTime(StartTime),
            EndTime: formatTime(EndTime),
            participantLimit: value.participantLimit,
            id: event.id
        };

        try {
            const success = await EditEvent(eventData, userId);

            if (success) {
                console.log("Event successfully modified!");
                navigation.goBack();
            } else {
                console.log("Failed to modify the event");
            }
        } catch (error) {
            console.error("Failed to modify the event:", error);
            setErrors({ form: "Failed to modify the event. Please try again." });
          
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: colors.background }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >

            <View style={{ backgroundColor: colors.primary, padding: 10 }}>
                <Text style={{ color: colors.text }}>{event.locationName}</Text>
                <View style={{ flexGrow: 1 }}>
                    <Text style={{ color: colors.text }}>{event.katuosoite}{event.location} </Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

                <View style={styles.container}>

                    <DateTimePicker setDate={setDate}
                        setStartTime={setStartTime}
                        setEndTime={setEndTime}
                        date={date} StartTime={StartTime}
                        EndTime={EndTime} />

                    <View style={styles.controls}>
                        <View style={styles.textInputContainer}>
                            <Icon name="format-title" size={20} style={styles.iconStyle}
                                color={colors.primary} />
                            <TextInput
                                style={styles.textInput}
                                mode="outlined"
                                placeholder="Event title"
                                containerStyle={styles.control}
                                value={value.title}
                                onChangeText={(text) => {
                                    setValue({ ...value, title: text });
                                    if (errors.title) {
                                        setErrors({ ...errors, title: null });
                                    }
                                }}

                            />

                        </View>
                        {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
                        <View style={styles.textareaContainer}>
                            <Icon name="information" size={20}
                                color={colors.primary} style={styles.iconStyle} />
                            <TextInput
                                style={styles.desc}
                                placeholder="Description"
                                editable
                                multiline
                                numberOfLines={10}
                                maxLength={400}
                                value={value.description}

                                onChangeText={(text) => {
                                    setValue({ ...value, description: text });

                                    if (errors.description) {
                                        setErrors({ ...errors, description: null });
                                    }
                                }}
                            />


                        </View>
                        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
                        <View style={styles.textInputContainer}>
                            <Icon name="account-multiple-plus" size={20}
                                color={colors.primary} style={styles.iconStyle} />
                            <TextInput
                                style={styles.textInput}
                                mode="outlined"

                                placeholder="Max participants"
                                containerStyle={styles.control}
                                keyboardType='numeric'
                                value={value.participantLimit.toString()}
                                onChangeText={(text) => {
                                    setValue({
                                        ...value,
                                        participantLimit: text ? parseInt(text, 10) : 0
                                    })
                                    if (errors.participantLimit) {
                                        setErrors({ ...errors, participantLimit: null });
                                    }
                                }}

                                maxLength={20}
                            />

                        </View>
                        {errors.participantLimit && <Text style={styles.errorText}>{errors.participantLimit}</Text>}
                        <View style={styles.buttons}>
                            <Button icon="check-circle" mode="elevated" title="Modify" style={styles.control} onPress={handleFormSubmit} >Confirm</Button>
                            <Button icon="delete" mode="elevated" title="Delete" style={styles.control} onPress={handleDelete} >Delete</Button>
                            <Button icon="close-circle" mode="elevated" title="Cancel" style={styles.control} onPress={() => navigation.goBack()}  >Cancel</Button>
                        </View>
                    </View>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>

    );
};

const styles = StyleSheet.create({
    DateContainer: {
        flexDirection: 'row',
        alignItems: 'center',

        padding: 10,

    },
    date: {

    },

    container: {
        height: 650,

        alignItems: "center",
        justifyContent: "center",
    },
    selected: {
        padding: 10,
        fontSize: 20,


    },
    textareaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginTop: 20,

    },

    textInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginTop: 20,


    },
    textInput: {
        width: '90%',
    },

    controls: {
        width: "80%",

    },
    control: {
        marginTop: 20,



    },
    iconStyle: {
        marginRight: 10,

    },
    desc: {
        flex: 1,
        textAlignVertical: 'top',
        height: 100,
        fontSize: 18,


    },
    inputStyle: {
        fontSize: 18,
        paddingLeft: 10,
    },
    leftIconContainerStyle: {
        paddingLeft: 15,
    },

    errorText: {
        color: 'red',
        fontSize: 16,
        padding: 2,
        marginTop: 5

    },

});


export default EditEventScreen;
