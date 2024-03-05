import React, { useState } from "react";
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation, useRoute } from '@react-navigation/native';
import { TextInput } from "react-native-paper";
import useAuth from '../../hooks/useAuth';
import useAddEvent from '../../hooks/useAddEvent'
import DateTimePicker from '../../components/DateTimePicker';
import { Button } from "react-native-paper"
import { validateInput } from '../../utils/validateInput';
import  formatTime  from '../../utils/formatTime';
import  formatDate  from '../../utils/formatDate';
import { useTheme } from 'react-native-paper';


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

    
    

    const addEvent = useAddEvent();
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
            locationId: selectedMapItem.properties.id,
            coordinates: selectedMapItem.geometry.coordinates,
            participantLimit: value.participantLimit,
            participants: 0,
        };

        const success = await addEvent(eventData, userId);

        if (success) {
            navigation.goBack();
        } else {
            console.log("Failed to add the event");
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: colors.background }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
           
            <View style={{ backgroundColor: colors.primary, padding:10}}>
                <Text style={{ color: colors.text }}>{selectedMapItem.properties.nimi_fi}</Text>
                <View style={{ flexGrow: 1 }}>
                    <Text style={{ color: colors.text }}>{selectedMapItem.properties.katuosoite}, </Text>
                    <Text style={{ color: colors.text }}>{selectedMapItem.properties.postitoimi}</Text>
                </View>
            </View>
          
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

                <View style={styles.container}>

                <DateTimePicker setDate={setDate}
                setStartTime={setStartTime}
                setEndTime={setEndTime} 
                date={date}StartTime={StartTime} 
                EndTime={EndTime}/>

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
                            <Button icon="check-circle" mode="elevated" title="Add" style={styles.control} onPress={handleFormSubmit} >Confirm</Button>
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

export default AddEventScreen;