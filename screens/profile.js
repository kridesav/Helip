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

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                console.log("User logged out");
            })
            .catch((error) => {
                console.error("Logout Error:", error);
            });
    };

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
                <Surface style={styles.bottomlist} elevation={5}>
                <Text style={styles.activityTitle}>My Activity</Text>
                <Surface style={styles.activitylist} elevation={4}>
                <Text style={styles.nameSubText2}>Events created: {profile?.eventsCreated.length}</Text>
                <Text style={styles.nameSubText2}>Events joined: {profile?.eventsParticipating.length}</Text>
                <Text style={styles.nameSubText2}>Comments: {profile?.commentsSent.length}</Text>
                </Surface>
                </Surface>
                <Surface style={styles.bottomlist} elevation={3}>
                    <Text style={{ padding: 10, color: colors.primary }}>My Events</Text>
                    <Divider />
                    <Text style={{ padding: 10, color: colors.primary }}>My Comments</Text>
                </Surface>
                <Surface style={styles.bottomlist} elevation={2}>
                    <TouchableOpacity onPress={() => navigation.navigate("SettingsScreen")}>
                        <Text style={{ padding: 10, color: colors.primary }}>Settings</Text>
                    </TouchableOpacity>
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
    nameSubText2: {
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
    button: {
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
});