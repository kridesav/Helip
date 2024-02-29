import React, { useState } from "react";
import { StyleSheet, Text, View, KeyboardAvoidingView, Platform, ScrollView, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input } from "react-native-elements";
import { useNavigation, useRoute } from '@react-navigation/native';
import { TextInput } from "react-native-gesture-handler";
import useAuth from '../../hooks/useAuth';
import useAddEvent from '../../hooks/useAddEvent'
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from "react-native"

const AddEventScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [value, setValue] = React.useState({
        title: "",
        description: "",
        participantLimit: 1,
    });
    const [date, setDate] = useState(new Date())
    const [StartTime, setStartTime] = useState(new Date())
    const [EndTime, setEndTime] = useState(new Date())

    const formatTime = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      };

      const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0'); 
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        return `${day}-${month}-${year}`;
    };
    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
    };

    const onChangeStartTime = (event, selectedTime) => {
        const currentTime = selectedTime || time;
        setStartTime(currentTime);
        setEndTime(currentTime);
    };
    const onChangeEndTime = (event, selectedTime) => {
        const currentTime = selectedTime || time;
        setEndTime(currentTime);
    };

    const addEvent = useAddEvent();
    const { selectedMapItem } = route.params;
    const { currentUser } = useAuth();
    const userId = currentUser?.uid;

    const handleFormSubmit = () => {
        Alert.alert(
            "Confirm",
            "Are you sure you want to add this event?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Yes", onPress: () => addEventToFirestore() }
            ]
        );
    };

    const addEventToFirestore = async () => {
        const eventData = {
            title: value.title,
            description: value.description || '',
            date: formatDate(date),
            StartTime: formatTime(StartTime),
            EndTime: formatTime(EndTime),
            locationName: selectedMapItem.name,
            coordinates: selectedMapItem.location.coordinates,
            participantLimit: value.participantLimit,
            locationId: selectedMapItem.sportsPlaceId,
           
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
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
            <View style={styles.selected}>
                <Text>{selectedMapItem.name}</Text>
                <Text>{selectedMapItem.location.address}</Text>
            </View>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <Text style={styles.selected} >Add event</Text>
                <View style={styles.container}>


                    <View style={styles.DateContainer}>
                        <Text>When:</Text>
                        <DateTimePicker
                            style={styles.date}
                            value={date}
                            mode="date"
                            display="default"
                            onChange={onChangeDate}
                        />
                           <DateTimePicker mode="time" is24Hour={true} value={StartTime} onChange={onChangeStartTime} />
                           <DateTimePicker mode="time" is24Hour={true} value={EndTime} onChange={onChangeEndTime} />
                    </View>
                 
                    <View style={styles.controls}>
                        <Input
                            placeholder="Title"
                            containerStyle={styles.control}
                            value={value.title}
                            onChangeText={(text) => setValue({ ...value, title: text })}
                            leftIcon={<Icon name="font" size={16} />}
                        />
                        <View style={styles.textareaContainer}>
                            <Icon name="info" size={16} style={styles.iconStyle} />
                            <TextInput
                                style={styles.desc}
                                placeholder="Description"
                                placeholderTextColor="#888"
                                editable
                                multiline
                                numberOfLines={10}
                                maxLength={400}
                                value={value.description}
                                onChangeText={(text) => setValue({ ...value, description: text })}
                            />
                        </View>
                        <Input
                            placeholder="Max participants"
                            containerStyle={styles.control}
                            keyboardType='numeric'
                            value={value.participantLimit.toString()}
                            onChangeText={(text) => setValue({
                                ...value,
                                participantLimit: text ? parseInt(text, 10) : 0
                            })}
                            leftIcon={<Icon name="users" size={16} />}
                            maxLength={20}
                        />

                        <Button title="Add" buttonStyle={styles.control} onPress={handleFormSubmit} />
                        <Button title="Cancel" buttonStyle={styles.control} onPress={() => navigation.goBack()} />
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
    },
    container: {
        height: 650,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    selected: {
        padding: 10,
        fontSize: 20,
        backgroundColor: "orange",

    },
    textareaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginTop: 10,
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
});

export default AddEventScreen;