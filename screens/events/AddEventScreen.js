import React, { useState } from "react";
import { StyleSheet, View, KeyboardAvoidingView, Platform, ScrollView, Alert, ImageBackground } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from '@react-navigation/native';
import { TextInput, Button, Text, useTheme, Surface } from "react-native-paper"
import useAuth from '../../hooks/useAuth';
import addEvent from '../../hooks/events/utils/addEvent'
import DateTimePicker from '../../components/DateTimePicker';
import { validateInput } from '../../utils/validateInput';
import formatTime from '../../utils/formatTime';
import formatDate from '../../utils/formatDate';


const AddEventScreen = () => {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const route = useRoute();
    const [value, setValue] = React.useState({
        title: "",
        description: "",
        participantLimit: "",
    });
    const [errors, setErrors] = useState({});
    const [date, setDate] = useState(new Date());
    const [StartTime, setStartTime] = useState(new Date());
    const [EndTime, setEndTime] = useState(new Date());

    const AddEvent = addEvent();
    const { selectedMapItem } = route.params;
    const { currentUser } = useAuth();
    const userId = currentUser?.uid;


    const handleFormSubmit = () => {
        if (validateInput(value, setErrors)) {
            console.log('Input data:', value);


            Alert.alert(
                "Confirm",
                "Are you sure you want to add this event? Remember to check the date and time.",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Yes", onPress: () => {
                            addEventToFirestore();
                            setValue({ title: '', description: '', participantLimit: 1 });
                            setErrors({});
                        }
                    }
                ]
            );
        } else {
            console.log('Input validation failed');
        }
    };

    const addEventToFirestore = async () => {
        const eventData = {
            title: value.title,
            description: value.description || '',
            date: formatDate(date),
            StartTime: formatTime(StartTime),
            EndTime: formatTime(EndTime),
            locationName: selectedMapItem.properties.nimi_fi,
            locationAddress: selectedMapItem.properties.katuosoite,
            location: selectedMapItem.properties.postitoimi,
            locationId: selectedMapItem.properties.id,
            coordinates: selectedMapItem.geometry.coordinates,
            participantLimit: value.participantLimit,
            participants: 0,
            usersParticipating: [],
        };

        const success = await AddEvent(eventData, userId);

        if (success) {
            navigation.goBack();
        } else {
            console.log("Failed to add the event");
        }
    };



    const styles = StyleSheet.create({
        backgroundImage: {
            flex: 1,
            width: "100%",
            height: "100%",
            backgroundColor: colors.surfaceVariant,
        },
        overlay: {
            flex: 1,
            padding: 20,
            justifyContent: "center",
            backgroundColor: colors.surfaceDisabled,
        },
        container: {
            alignItems: "center",
            justifyContent: "center",
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
            marginTop: 10

        },
        control: {
            marginTop: 20,

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
            marginTop:0,
            margin:5

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
                <Text style={{ color: colors.primary, fontWeight: "bold", fontSize: 18}}>{selectedMapItem.properties.nimi_fi}</Text>
                <View style={{ flexGrow: 1 }}>
                    <Text style={{ color: colors.primary, fontSize: 15 }}>{selectedMapItem.properties.katuosoite}</Text>
                    <Text style={{ color: colors.primary,fontSize: 15}}>{selectedMapItem.properties.postitoimi}</Text>
                </View>
            </View>
            <ImageBackground source={require("../../assets/helip_bg.png")} resizeMode="cover" style={styles.backgroundImage}>
                <ScrollView contentContainerStyle={styles.flexGrow}>

                    <Surface style={styles.overlay} elevation={5}>
                        <View style={styles.container}>
                            <Surface elevation={0}>
                                <DateTimePicker setDate={setDate}
                                    setStartTime={setStartTime}
                                    setEndTime={setEndTime}
                                    date={date} StartTime={StartTime}
                                    EndTime={EndTime} />
                            </Surface>
                            <View style={styles.controls}>
                                <Surface elevation={4} style={styles.inputSurface}>
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
                                    <Button icon="check-circle" mode="elevated" title="Add" style={styles.control} onPress={handleFormSubmit} >Confirm</Button>
                                    <Button icon="close-circle" mode="elevated" title="Cancel" style={styles.control} onPress={() => navigation.goBack()}  >Cancel</Button>
                                </View>
                            </View>

                        </View>
                    </Surface>

                </ScrollView>
            </ImageBackground>
        </KeyboardAvoidingView>

    );
};


export default AddEventScreen;