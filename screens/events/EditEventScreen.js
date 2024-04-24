import React, { useState } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform, ScrollView, Alert, ImageBackground, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from '@react-navigation/native';
import { TextInput, Button, Text, useTheme, Surface } from "react-native-paper";
import useAuth from '../../hooks/useAuth';
import DateTimePicker from '../../components/DateTimePicker';
import { validateInput } from '../../utils/validateInput';
import formatTime from '../../utils/formatTime';
import formatDate from '../../utils/formatDate';
import editEvent from "../../hooks/events/utils/editEvent";
import deleteEvent from "../../hooks/events/utils/deleteEvent";
import { parseTime, parseDate } from '../../utils/parse'
import { color } from "react-native-elements/dist/helpers";


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


    const styles = StyleSheet.create({
        backgroundImage: {
            flex: 1,
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
            backgroundColor: colors.inversePrimary,
        },
        overlay: {
            flex: 1,
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.4)",

        },
        container: {
            alignItems: "center",
            justifyContent: "center",
            padding: 10
        },

        textareaContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingBottom: 10,
            marginTop: 20,
            width: '98%',

        },

        textInputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingBottom: 10,
            marginTop: 20,


        },
        textInput: {
            width: '90%',
        },

        controls: {
            width: "100%",
            marginTop: 25

        },
        control: {
            marginTop: 20,
            borderColor: colors.primary
        },
        iconStyle: {
            marginRight: 5,

        },
        desc: {
            flex: 1,
            textAlignVertical: 'top',
            height: 100,
            fontSize: 18,
        },
        inputStyle: {
            fontSize: 18,

        },
        leftIconContainerStyle: {

        },

        errorText: {
            color: colors.error,
            fontSize: 16,
            padding: 2,
            marginTop: 0,
            margin: 5

        },
        inputSurface: {
            backgroundColor: colors.inversePrimary,
            borderRadius: 10,
            padding: 5,
            marginBottom: 15,

        }

    });

    return (

        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: colors.background }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
            <View style={{ backgroundColor: colors.inversePrimary, padding: 10 }}>
                <Text style={{ color: colors.primary, fontWeight: "bold", fontSize: 18 }}>{event.locationName}</Text>
                <View style={{ flexGrow: 1 }}>
                    <Text style={{ color: colors.primary, fontSize: 15 }}>{event.locationAddress}</Text>
                    <Text style={{ color: colors.primary, fontSize: 15 }}>{event.location}</Text>
                </View>
            </View>
            <ImageBackground source={require("../../assets/helip_bg.png")} resizeMode="cover" style={styles.backgroundImage}>
                <View style={styles.overlay}>
                    <ScrollView contentContainerStyle={styles.flexGrow}>
                        <View style={styles.container}>
                            <Surface elevation={5}>
                                <DateTimePicker setDate={setDate}
                                    setStartTime={setStartTime}
                                    setEndTime={setEndTime}
                                    date={date} StartTime={StartTime}
                                    EndTime={EndTime} />
                            </Surface>
                            <View style={styles.controls}>
                                <Surface elevation={5} style={styles.inputSurface} >
                                    <View style={styles.textInputContainer}>
                                        <Icon name="format-title" size={20} style={styles.iconStyle}
                                            color={colors.primary} />
                                        <TextInput
                                            style={styles.textInput}
                                            mode="outlined"
                                            label="Event title"
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
                                </Surface>
                                <Surface elevation={4} style={styles.inputSurface}>
                                    <View style={styles.textareaContainer}>
                                        <Icon name="information" size={20}
                                            color={colors.primary} style={styles.iconStyle} />
                                        <TextInput
                                            style={styles.desc}
                                            mode="outlined"
                                            label="Description"
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
                                </Surface>
                                <Surface elevation={4} style={styles.inputSurface}>
                                    <View style={styles.textInputContainer}>
                                        <Icon name="account-multiple-plus" size={20}
                                            color={colors.primary} style={styles.iconStyle} />
                                        <TextInput
                                            style={styles.textInput}
                                            mode="outlined"
                                            label="Max participants"
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
                                </Surface>
                                <View style={styles.buttons}>
                                    <Button icon="check-circle" mode="contained-tonal" title="Modify" style={styles.control} onPress={handleFormSubmit} >Confirm</Button>
                                    <Button icon="delete" mode="contained-tonal" title="Delete" style={styles.control} onPress={handleDelete} >Delete</Button>
                                    <Button icon="close-circle" mode="contained-tonal" title="Cancel" style={styles.control} onPress={() => navigation.goBack()}  >Cancel</Button>
                                </View>
                            </View>

                        </View>

                    </ScrollView>
                </View>
            </ImageBackground>

        </KeyboardAvoidingView >

    );
};



export default EditEventScreen;
