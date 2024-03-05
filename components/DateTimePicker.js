import React, { useState } from "react";
import { StyleSheet, Text, View, Platform, TouchableOpacity } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme } from 'react-native-paper';

export default CustomDateTimePicker = ({ setDate, setStartTime, setEndTime, date, StartTime, EndTime }) => {
    const { colors } = useTheme();
    const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');
    const [showStartTimePicker, setShowStartTimePicker] = useState(Platform.OS === 'ios');
    const [showEndTimePicker, setShowEndTimePicker] = useState(Platform.OS === 'ios');

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
        if (Platform.OS === 'android') {
            setShowDatePicker(false);
        }
    };

    const onChangeStartTime = (event, selectedTime) => {
        const currentTime = selectedTime || StartTime;
        setStartTime(currentTime);
        if (Platform.OS === 'android') {
            setShowStartTimePicker(false);
        }
    };

    const onChangeEndTime = (event, selectedTime) => {
        const currentTime = selectedTime || EndTime;
        setEndTime(currentTime);
        if (Platform.OS === 'android') {
            setShowEndTimePicker(false);
        }
    };

    return (
        <View style={styles.DateContainer}>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Icon name="calendar" size={20} color={colors.primary} />
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                    minimumDate={new Date()}
                />
            )}

            <TouchableOpacity onPress={() => setShowStartTimePicker(true)}>
                <Icon name="clock-start" size={20} color={colors.primary} style={styles.iconStyle} />
            </TouchableOpacity>
            {showStartTimePicker && (
                <DateTimePicker mode="time" is24Hour={true} value={StartTime} onChange={onChangeStartTime} />
            )}

            <TouchableOpacity onPress={() => setShowEndTimePicker(true)}>
                <Icon name="clock-end" size={20} style={styles.iconStyle} color={colors.primary} />
            </TouchableOpacity>
            {showEndTimePicker && (
                <DateTimePicker mode="time" is24Hour={true} value={EndTime} onChange={onChangeEndTime} />
            )}
        </View>

    )
}

const styles = StyleSheet.create({
    DateContainer: {
        flexDirection: 'row',
        alignItems: 'center',

        padding: 10,

    },
    iconStyle: {
        marginLeft: 10,

    },

});