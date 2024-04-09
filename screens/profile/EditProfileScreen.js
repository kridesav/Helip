import React, { useState, useEffect } from 'react';
import { Button, TextInput, useTheme, Surface, Icon, Avatar } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import useAuth from '../../hooks/useAuth';
import editUser from '../../hooks/events/utils/editUser';

export default function EditProfileScreen({ route }) {
    const { profile } = route.params;
    const [firstName, setFirstName] = useState(profile?.firstName ?? '');
    const [lastName, setLastName] = useState(profile?.lastName ?? '');
    const [displayName, setDisplayName] = useState(profile?.displayName ?? '');
    const [avatar, setAvatar] = useState(profile?.profilePictureUrl ?? "");
    const user = useAuth();

    const { colors } = useTheme();

    useEffect(() => {
        if (!profile?.profilePictureUrl) {
            setAvatar("https://www.w3schools.com/howto/img_avatar.png");
        } else {
            setAvatar(profile?.profilePictureUrl);
        }
    }, [profile?.profilePictureUrl]);

    const handleSave = async () => {
        const userData = {
            firstName: firstName,
            lastName: lastName,
            displayName: displayName,
            profilePictureUrl: avatar,
        };

        try {
            const result = await editUser()(userData, user.currentUser.uid);
            if (result) {
                console.log("Profile updated");
            }
        } catch (error) {
            console.error("Profile update error:", error);
        }
    };

    return (
        <Surface style={styles.container}>
            <View style={styles.content}>
                <Surface elevation={2} style={styles.bottomlist}>
                <Avatar.Image
                    style={{ alignSelf: "center", marginBottom: 20 }}
                    size={100}
                    source={{ uri: avatar }}
                />
                <TextInput
                    style={styles.input}
                    label="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                />
                <TextInput
                    style={styles.input}
                    label="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                />
                <TextInput
                    style={styles.input}
                    label="Display Name"
                    value={displayName}
                    onChangeText={setDisplayName}
                />
                </Surface>
                <View style={styles.buttons}>
                    <Button style={styles.button} icon="camera-image" mode="outlined" compact disabled >
                        Change Avatar
                    </Button>
                    <Button style={styles.button} icon="content-save" mode="outlined" compact onPress={handleSave}>
                        Save
                    </Button>
                </View>
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
        borderRadius: 10,
        padding: 30,
    },
    input: {
        marginBottom: 10,
        backgroundColor: 'transparent',
        borderRadius: 10,
    },
});