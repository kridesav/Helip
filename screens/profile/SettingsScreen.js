import React, { useState, useEffect } from 'react';
import { Button, Surface, Text, Switch, Portal, Dialog, Icon, TextInput } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import { themeContext } from '../../utils/themeContext';
import changePassword from '../../hooks/changePassword';
import deleteUserAccount from '../../hooks/deleteUser';
import reauthenticateUser from '../../hooks/reauthenticateUser';

export default function SettingsScreen({ route }) {
    const { theme, setTheme, themeMode, setThemeMode } = React.useContext(themeContext);
    const [notifications, setNotifications] = useState(true);
    const [location, setLocation] = useState(true);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [secondDialogVisible, setSecondDialogVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [action, setAction] = useState(null);
    const [passwordDialogVisible, setPasswordDialogVisible] = useState(false);

    const hideDialog = (confirmation) => {
        setDeleteDialog(false);
        if (confirmation) {
            alert("Account deleted");
            deleteUserAccount();
        } else {
            alert("Account not deleted");
        }
    };

    const handleChangePassword = () => {
        setAction('changePassword');
        setSecondDialogVisible(true);

    };

    const handleReauthenticateUser = (email, password) => {
        reauthenticateUser(email, password)
            .then(() => {
                setSecondDialogVisible(false);
                setPassword('');
                setEmail('');

                if (action === 'changePassword') {
                    setPasswordDialogVisible(true);
                } else if (action === 'deleteAccount') {
                    setDeleteDialog(true);
                }

                setAction(null);
            })
            .catch((error) => {
                if (error.code === 'auth/invalid-email') {
                    alert('Please enter a valid email address.');
                    setEmail('');
                } else if (error.code === 'auth/invalid-credential') {
                    alert('Incorrect password. Please try again.');
                    setPassword('');
                } else if (error.code === 'auth/too-many-requests') {
                    alert('Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.');
                    setEmail('');
                    setPassword('');
                }
                console.log(error);
            });
    };

    const onToggleNightMode = () => setThemeMode(themeMode === 'dark' ? 'light' : 'dark');

    const onToggleNotifications = () => setNotifications(!notifications);
    // TODO logic

    const onToggleLocation = () => setLocation(!location);
    // TODO logic

    function handleDeleteAccount() {
        setAction('deleteAccount');
        setSecondDialogVisible(true);
    }

    return (
        <Surface style={styles.container}>
            <View style={styles.content}>
                <Surface elevation={5} style={styles.bottomlist}>
                    <View style={styles.switchContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon source="map-marker-outline" size={24} />
                            <Text style={styles.nameSubText}>Location</Text>
                        </View>
                        <Switch
                            style={styles.input}
                            value={location}
                            onValueChange={onToggleLocation}
                            disabled
                        />
                    </View>
                    <View style={styles.switchContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon source="bell" size={24} />
                            <Text style={styles.nameSubText}>Notifications</Text>
                        </View>
                        <Switch
                            style={styles.input}
                            value={notifications}
                            onValueChange={onToggleNotifications}
                            disabled
                        />
                    </View>
                    <View style={styles.switchContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Icon source="theme-light-dark" size={24} />
                            <Text style={styles.nameSubText}>Night Mode</Text>
                        </View>
                        <Switch
                            style={styles.input}
                            value={themeMode === 'dark'}
                            onValueChange={onToggleNightMode}
                        />
                    </View>
                    <Portal>
                        <Dialog visible={deleteDialog} onDismiss={() => hideDialog(false)}>
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
                        <Dialog visible={secondDialogVisible} onDismiss={() => {
                            setSecondDialogVisible(false)
                            setAction(null);
                            setEmail('');
                            setPassword('');
                        }}>
                            <Dialog.Title>Confirmation needed</Dialog.Title>
                            <Dialog.Content>
                                <TextInput
                                    label="Email"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                                <TextInput
                                    label="Password"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => {
                                    setSecondDialogVisible(false)
                                    setAction(null);
                                    setEmail('');
                                    setPassword('');
                                }}>Cancel</Button>
                                <Button onPress={() => handleReauthenticateUser(email, password)}>Submit</Button>
                            </Dialog.Actions>
                        </Dialog>
                        <Dialog visible={passwordDialogVisible} onDismiss={() => {
                            setPasswordDialogVisible(false)
                            setNewPassword('');
                            setConfirmPassword('');
                        }}>
                            <Dialog.Title>Change Password</Dialog.Title>
                            <Dialog.Content>
                                <TextInput
                                    label="New Password"
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    secureTextEntry
                                />
                                <TextInput
                                    label="Confirm Password"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry
                                />
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => {
                                    setPasswordDialogVisible(false)
                                    setNewPassword('');
                                    setConfirmPassword('');
                                }}>
                                    Cancel</Button>
                                <Button onPress={() => {
                                    if (newPassword === confirmPassword) {
                                        changePassword(newPassword).then(() => {
                                            setPasswordDialogVisible(false);
                                            setNewPassword('');
                                            setConfirmPassword('');
                                            alert("Password changed");
                                        });
                                    } else {
                                        alert("Passwords do not match");
                                    }
                                }}>Submit</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                </Surface>
                <Surface style={styles.bottomlist} elevation={4}>
                    <Button icon="form-textbox-password" compact contentStyle={styles.button} onPress={handleChangePassword}>
                        Change Password
                    </Button>
                </Surface>
                <Surface style={styles.bottomlist} elevation={2}>
                    <Button icon="account-remove" compact contentStyle={styles.button} labelStyle={{ color: "red" }} onPress={handleDeleteAccount}>
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
    content: {
        flexGrow: 1,
        alignItems: "center",
        padding: 20,
    },
    nameSubText: {
        fontSize: 16,
        marginLeft: 10,
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
    button: {
        justifyContent: "flex-start",
        padding: 8,
    },
});