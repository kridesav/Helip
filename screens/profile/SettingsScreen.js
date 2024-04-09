import React, { useState } from 'react';
import { Button, TextInput, useTheme, Surface, Text, Divider, Switch, Portal, Dialog, Icon } from 'react-native-paper';
import { View, StyleSheet, TouchableOpacity } from 'react-native';


export default function SettingsScreen({ route }) {
    const [nightMode, setNightMode] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [location, setLocation] = useState(true);
    const { colors } = useTheme();
    const [visible, setVisible] = useState(false);

    const hideDialog = (confirmation) => {
        setVisible(false);
        if (confirmation) {
            alert("Account deleted");
            // TODO logic
        } else {
            alert("Account not deleted");
        }
    };

    const onToggleNightMode = () => setNightMode(!nightMode);

    const onToggleNotifications = () => setNotifications(!notifications);

    const onToggleLocation = () => setLocation(!location);

    function handleDeleteAccount() {
        setVisible(true);
    }

    return (
        <Surface style={styles.container}>
            <View style={styles.content}>
                <Surface elevation={5} style={styles.bottomlist}>
                    <View style={styles.switchContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon source="map-marker-outline" color="white" size={24} />
                            <Text style={styles.nameSubText}>Location</Text>
                        </View>
                        <Switch
                            style={styles.input}
                            value={location}
                            onValueChange={onToggleLocation}
                        />
                    </View>
                    <View style={styles.switchContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon source="bell" color="white" size={24} />
                            <Text style={styles.nameSubText}>Notifications</Text>
                        </View>
                        <Switch
                            style={styles.input}
                            value={notifications}
                            onValueChange={onToggleNotifications}
                        />
                    </View>
                    <View style={styles.switchContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon source="theme-light-dark" color="white" size={24} />
                            <Text style={styles.nameSubText}>Night Mode</Text>
                        </View>
                        <Switch
                            style={styles.input}
                            value={nightMode}
                            onValueChange={onToggleNightMode}
                        />
                    </View>
                    <Portal>
                        <Dialog visible={visible} onDismiss={() => hideDialog(false)}>
                            <Dialog.Icon icon="alert" color="red" />
                            <Dialog.Title style={{ textAlign: 'center' }}>Delete Account</Dialog.Title>
                            <Dialog.Content>
                                <Text variant="bodyMedium">
                                    Are you sure you want to delete your account? This action is permanent.
                                </Text>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => hideDialog(false)}>Cancel</Button>
                                <Button onPress={() => hideDialog(true)}>Delete</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                </Surface>
                <Surface style={styles.bottomlist} elevation={4}>
                    <Button icon="form-textbox-password" compact contentStyle={styles.button2}>
                        Change Password
                    </Button>
                </Surface>
                <Surface style={styles.bottomlist} elevation={2}>
                    <Button icon="account-remove" compact contentStyle={styles.button2} labelStyle={{ color: "red" }} onPress={handleDeleteAccount}>
                        Delete Account
                    </Button>
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
        fontSize: 16,
        marginLeft: 10,
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
        borderRadius: 10,
    },
    input: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    button2: {
        justifyContent: "flex-start",
        padding: 8,
    },
});