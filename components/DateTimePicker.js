import React, { useState } from "react";
import { StyleSheet, View, Platform, TouchableOpacity } from "react-native";
import RNDateTimePicker from '@react-native-community/datetimepicker';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useTheme, Text, Button, Surface } from 'react-native-paper';

export default CustomDateTimePicker = ({ setDate, setStartTime, setEndTime, date, StartTime, EndTime }) => {
    const { colors } = useTheme();
    const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');
    const [showStartTimePicker, setShowStartTimePicker] = useState(Platform.OS === 'ios');
    const [showEndTimePicker, setShowEndTimePicker] = useState(Platform.OS === 'ios');

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
        if (Platform.OS === 'android') {
            setTimeout(() => {
                setShowDatePicker(false);
            }, 50);
        }
    };

    const onChangeStartTime = (event, selectedTime) => {
        const currentTime = selectedTime || StartTime;
        setStartTime(currentTime);
        setEndTime(currentTime);
        if (Platform.OS === 'android') {
            setTimeout(() => {
                setShowStartTimePicker(false);
            }, 50);
        }
    };

    const onChangeEndTime = (event, selectedTime) => {
        const currentTime = selectedTime || EndTime;
        setEndTime(currentTime);
        if (Platform.OS === 'android') {
            setTimeout(() => {
                setShowEndTimePicker(false);
            }, 50);
        }
    };

    const formatDate = (date) => {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options).replace(/ /g, '. ');
    };
    
    const formatTime = (time) => {
        const options = { hour: '2-digit', minute: '2-digit', hour12: false };
        return time.toLocaleTimeString('en-GB', options);
    };

    const styles = StyleSheet.create({
        DateContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            backgroundColor: colors.inversePrimary,
            borderRadius: 10,
        },
        iconStyle: {
            marginLeft: 5,
        },

        text: {
            fontSize: 13,
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        textBackground: {
            marginLeft: 10,
            padding: 7,
            borderRadius: 10,
        },

    });

    return (
        <Surface style={styles.DateContainer}>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.row}>
                <Icon name="calendar" size={20} color={colors.primary} />
                {Platform.OS === 'android' && <Surface elevation={4} style={styles.textBackground}><Text style={styles.text}>{formatDate(date)}</Text></Surface>}
            </TouchableOpacity>
            {showDatePicker && (
                <RNDateTimePicker
                    value={date}
                    mode="date"                    
                    display="default"
                    onChange={onChangeDate}
                    minimumDate={new Date()}
                />
            )}
    
            <TouchableOpacity onPress={() => setShowStartTimePicker(true)} style={styles.row}>
                <Icon name="clock-start" size={20} color={colors.primary} style={styles.iconStyle} />
                {Platform.OS === 'android' && <Surface elevation={4} style={styles.textBackground}><Text style={styles.text}>{formatTime(StartTime)}</Text></Surface>}
            </TouchableOpacity>
            {showStartTimePicker && (
                <RNDateTimePicker mode="time" is24Hour={true} value={StartTime} onChange={onChangeStartTime} />
            )}
    
            <TouchableOpacity onPress={() => setShowEndTimePicker(true)} style={styles.row}>
                <Icon name="clock-end" size={20} style={styles.iconStyle} color={colors.primary} />
                {Platform.OS === 'android' && <Surface elevation={4} style={styles.textBackground}><Text style={styles.text}>{formatTime(EndTime)}</Text></Surface>}
            </TouchableOpacity>
            {showEndTimePicker && (
                <RNDateTimePicker mode="time" is24Hour={true} value={EndTime} onChange={onChangeEndTime} />
            )}
        </Surface>
    );
}

