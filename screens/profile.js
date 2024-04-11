import React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { useTheme, Text, Avatar, Button, Surface } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useFetchCurrentUserProfile } from "../hooks/useFetchCurrentUserProfile";
import { signOut } from "firebase/auth";
import useAuth from "../hooks/useAuth";

export default function ProfileScreen() {
    const navigation = useNavigation();
    const { currentUser, auth } = useAuth();
    const { profile } = useFetchCurrentUserProfile(currentUser?.uid);

    const { displayName, firstName, lastName, email, eventsCreated, eventsParticipating, commentsSent, profilePictureUrl } = profile || {};

    const avatarUrl = `https://api.multiavatar.com/${profilePictureUrl || displayName}.png`;

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                console.log("User logged out");
            })
            .catch((error) => {
                console.error("Logout Error:", error);
            });
    };

    const navigateToEditProfile = () => navigation.navigate("EditProfileScreen", { profile });
    const navigateToMyEvents = () => navigation.navigate("My Events");
    const navigateToSettings = () => navigation.navigate("SettingsScreen");

    return (
        <Surface style={styles.container} elevation={1}>
            <ScrollView contentContainerStyle={styles.content}>
                <Avatar.Image size={100} source={{ uri: avatarUrl }} />
                <Text style={styles.nameText}>{displayName ?? "No display name"}</Text>
                <Text style={styles.nameSubText}>{firstName ?? "No first name"} {lastName ?? "No last name"}</Text>
                <Text style={styles.nameSubText}>{email ?? "No email"}</Text>
                <View style={styles.buttons}>
                    <Button mode="outlined" icon="logout" compact style={styles.button} onPress={handleLogout}>Log out</Button>
                    <Button mode="outlined" icon="account-edit" compact style={styles.button} onPress={navigateToEditProfile}>Edit Profile</Button>
                </View>
                <Surface style={styles.bottomlist} elevation={5}>
                    <Text style={styles.activityTitle}>My Activity</Text>
                    <Surface style={styles.activitylist} elevation={4}>
                        <Text style={styles.activityText}>Events created: {eventsCreated?.length}</Text>
                        <Text style={styles.activityText}>Events joined: {eventsParticipating?.length}</Text>
                        <Text style={styles.activityText}>Comments: {commentsSent?.length}</Text>
                    </Surface>
                </Surface>
                <Surface style={styles.bottomlist} elevation={3}>
                    <Button icon="calendar" compact contentStyle={styles.button2} onPress={navigateToMyEvents}>My Events </Button>
                    <Button icon="message" compact contentStyle={styles.button2}>My Comments </Button>
                </Surface>
                <Surface style={styles.bottomlist} elevation={2}>
                    <Button icon="account-settings" compact contentStyle={styles.button2} onPress={navigateToSettings}>Settings</Button>
                </Surface>
            </ScrollView>
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
        marginTop: 30,
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
    activityText: {
        color: "white",
        fontSize: 12,
        marginTop: 2,
        padding: 4,
        textAlign: "center",
    },
    buttons: {
        marginTop: 30,
        flexDirection: "row",
        justifyContent: "space-around",
        width: "70%",
    },
    bottomlist: {
        width: "100%",
        marginTop: 30,
        borderRadius: 10,
    },
    activityTitle: {
        padding: 10,
        color: "white",
        textAlign: "center",
        fontSize: 16,
    },
    activitylist: {
        width: "100%",
        paddingBottom: 10,
        borderBottomEndRadius: 10,
        borderBottomStartRadius: 10,
    },
    button2: {
        justifyContent: "flex-start",
        padding: 8,
    },
});