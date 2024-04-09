import React, { useState } from 'react';
import { Button, TextInput, useTheme, Surface, Text, Divider } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';

export default function EditProfileScreen({ route }) {
    const { profile } = route.params;
    const [firstName, setFirstName] = useState(profile?.firstName ?? '');
    const [lastName, setLastName] = useState(profile?.lastName ?? '');
    const [displayName, setDisplayName] = useState(profile?.displayName ?? '');

    const { colors } = useTheme();

    const handleSave = () => {
        // TODO save to firestore
        console.log(firstName, lastName, displayName);
    };

    return (
        <Surface style={styles.container}>
            <View style={styles.content}>
                <Surface style={styles.bottomlist}>
                <TextInput
                    style={styles.input}
                    label="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                />
                <Divider />
                <TextInput
                    style={styles.input}
                    label="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                />
                <Divider />
                <TextInput
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
    },
    input: {
        marginBottom: 10,
    },
});