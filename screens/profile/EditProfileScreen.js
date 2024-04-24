import React, { useState } from 'react';
import { Button, TextInput, Surface, Avatar, HelperText } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import useAuth from '../../hooks/useAuth';
import editUser from '../../hooks/events/utils/editUser';


export default function EditProfileScreen({ route }) {
    const { profile: initialProfile } = route.params;
    const [profile, setProfile] = useState(initialProfile);
    const [firstName, setFirstName] = useState(profile?.firstName ?? '');
    const [lastName, setLastName] = useState(profile?.lastName ?? '');
    const [displayName, setDisplayName] = useState(profile?.displayName ?? '');
    const [avatar, setAvatar] = useState(profile?.profilePictureUrl ?? "");
    const [visible, setVisible] = useState(false);
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [displayNameError, setDisplayNameError] = useState('');
    const user = useAuth();

    const handleFirstNameChange = (text) => {
        setFirstName(text);
        if (text.length < 2 || text.length > 16) {
            setFirstNameError('First Name must be between 2 and 16 characters');
        } else {
            setFirstNameError('');
        }
    };
    
    const handleLastNameChange = (text) => {
        setLastName(text);
        if (text.length < 2 || text.length > 16) {
            setLastNameError('Last Name must be between 2 and 16 characters');
        } else {
            setLastNameError('');
        }
    };
    
    const handleDisplayNameChange = (text) => {
        setDisplayName(text);
        if (text.length < 2 || text.length > 16) {
            setDisplayNameError('Display Name must be between 2 and 16 characters');
        } else {
            setDisplayNameError('');
        }
    };

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
                setProfile(userData);
            }
        } catch (error) {
            console.error("Profile update error:", error);
        }
        setVisible(false)
    };


    const handleAvatar = () => setVisible(!visible);

    return (
        <Surface style={styles.container}>
            <View style={styles.content}>
                <Surface elevation={2} style={styles.bottomlist}>
                    <Avatar.Image
                        style={{ alignSelf: "center", marginBottom: 20 }}
                        size={100}
                        source={{ uri: `https://api.multiavatar.com/${profile?.profilePictureUrl ? profile.profilePictureUrl : profile?.displayName}.png` }}
                    />
                    <TextInput
                        style={styles.input}
                        label="First Name"
                        value={firstName}
                        onChangeText={handleFirstNameChange}
                    />
                    <HelperText type="error" visible={!!firstNameError}>
                    {firstNameError}
                    </HelperText>
                    <TextInput
                        style={styles.input}
                        label="Last Name"
                        value={lastName}
                        
                        onChangeText={handleLastNameChange}
                    />
                    <HelperText type="error" visible={!!lastNameError}>
                    {lastNameError}
                    </HelperText>
                    <TextInput
                        style={styles.input}
                        label="Display Name"
                        value={displayName}
                        onChangeText={handleDisplayNameChange}
                    />
                    <HelperText type="error" visible={!!displayNameError}>
                    {displayNameError}
                    </HelperText>
                    {visible && (
                        <TextInput
                            style={styles.input}
                            label="Generate avatar with nickname"
                            value={avatar}
                            onChangeText={setAvatar}
                        />
                    )}
                </Surface>
                <View style={styles.buttons}>
                    <Button style={styles.button} icon="camera-image" mode="outlined" compact onPress={handleAvatar} >
                        Change Avatar
                    </Button>
                    <Button style={styles.button} icon="content-save" mode="outlined" compact onPress={handleSave} disabled={!!firstNameError || !!lastNameError || !!displayNameError}>
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
    content: {
        flexGrow: 1,
        alignItems: "center",
        padding: 20,
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
        padding: 30,
    },
    input: {
        marginBottom: 10,
        backgroundColor: 'transparent',
        borderRadius: 10,
    },
});