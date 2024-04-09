import React, { useState } from 'react';
import { Button, TextInput, useTheme, Surface, Text, Divider, Switch } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';


export default function SettingsScreen({ route }) {
    const [nightMode, setNightMode] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [location, setLocation] = useState(true);
    const { colors } = useTheme();

    const onToggleNightMode = () => setNightMode(!nightMode);

    const onToggleNotifications = () => setNotifications(!notifications);

    const onToggleLocation = () => setLocation(!location);

    return (
        <Surface style={styles.container}>
            <View style={styles.content}>
                <Surface elevation={2} style={styles.bottomlist}>
                    <View style={styles.switchContainer}>
                        <Text style={styles.nameSubText}>Location</Text>
                        <Switch
                            style={styles.input}
                            value={location}
                            onValueChange={onToggleLocation}
                        />
                    </View>
                    <View style={styles.switchContainer}>
                        <Text style={styles.nameSubText}>Notifications</Text>
                        <Switch
                            style={styles.input}
                            value={notifications}
                            onValueChange={onToggleNotifications}
                        />
                    </View>
                    <View style={styles.switchContainer}>
                        <Text style={styles.nameSubText}>Night Mode</Text>
                        <Switch
                            style={styles.input}
                            value={nightMode}
                            onValueChange={onToggleNightMode}
                        />
                    </View>
                </Surface>
            </View>
        </Surface>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        justifyContent: "center",
        alignItems: "center",
    },
    headerText: {
        color: "white",
        fontSize: 18,
    },
    content: {
        flexGrow: 1,
        alignItems: "center",
        padding: 20,
    },
    nameText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 20,
        marginTop: 10,
    },
    nameSubText: {
        color: "white",
        fontSize: 16,
        marginTop: 2,
    },
    buttons: {
        marginTop: 30,
        flexDirection: "row",
        justifyContent: "space-around",
        width: "70%",
    },
    button: {
    },
    bottomlist: {
        width: "100%",
        marginTop: 30,
    },
    input: {
        marginBottom: 10,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
});