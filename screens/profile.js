import React, { useContext, useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from "react-native";
import { useTheme, Text, Avatar, Button, Divider, Surface, Dialog, Portal } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useFetchCurrentUserProfile } from "../hooks/useFetchCurrentUserProfile";
import { signOut } from "firebase/auth";
import useAuth from "../hooks/useAuth";
import placeholderIcon from "../assets/icon.png";


export default function ProfileScreen() {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const { currentUser, auth } = useAuth();
    const { profile } = useFetchCurrentUserProfile(currentUser?.uid);
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

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                console.log("User logged out");
            })
            .catch((error) => {
                console.error("Logout Error:", error);
            });
    };

    function handleDeleteAccount() {
        setVisible(true);
    }

    return (
        <Surface style={styles.container} elevation={1}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Profile</Text>
            </View>
            <ScrollView contentContainerStyle={styles.content}>
                <Avatar.Image
                    size={100}
                    source={placeholderIcon}
                />
                <Text style={styles.nameText}>
                    {profile?.displayName ?? "No display name"}
                </Text>
                <Text style={styles.nameSubText}>
                    {profile?.firstName ?? "No first name"} {profile?.lastName ?? "No last name"}
                </Text>
                <Text style={styles.nameSubText}>
                    {profile?.email ?? "No email"}
                </Text>
                <View style={styles.buttons}>
                    <Button mode="outlined" icon="logout" compact style={styles.button} onPress={handleLogout}>
                        Log out
                    </Button>
                    <Button mode="outlined" icon="account-edit" compact style={styles.button} onPress={() => navigation.navigate("EditProfileScreen", { profile })}>
                        Edit Profile
                    </Button>
                </View>
                <Surface style={styles.bottomlist} elevation={4}>
                    <TouchableOpacity onPress={() => navigation.navigate("SettingsScreen")}>
                        <Text style={{ padding: 10, color: colors.primary }}>Settings</Text>
                    </TouchableOpacity>
                    <Divider />
                    <TouchableOpacity onPress={() => navigation.navigate("MyEventsStats")}>
                        <Text style={{ padding: 10, color: colors.primary }}>My Events data</Text>
                    </TouchableOpacity>
                    <Divider />
                    <TouchableOpacity onPress={() => navigation.navigate("ChangePWScreen")}>
                        <Text style={{ padding: 10, color: colors.primary }}>Change Password</Text>
                    </TouchableOpacity>
                    <Divider />
                    <TouchableOpacity onPress={handleDeleteAccount}>
                        <Text style={{ padding: 10, color: "red" }}>Delete Account</Text>
                    </TouchableOpacity>
                    <Portal>
                        <Dialog visible={visible} onDismiss={() => hideDialog(false)}>
                            <Dialog.Icon icon="alert" color="red" />
                            <Dialog.Title style={{textAlign: 'center'}}>Delete Account</Dialog.Title>
                            <Dialog.Content>
                                <Text variant="bodyMedium">
                                    Are you sure you want to delete your account? This action is irreversible.
                                </Text>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={() => hideDialog(false)}>Cancel</Button>
                                <Button onPress={() => hideDialog(true)}>Delete</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                </Surface>
            </ScrollView>
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
        fontSize: 14,
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
});