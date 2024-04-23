import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Card, Modal, Portal, Text, Button, useTheme, Avatar } from "react-native-paper";


const Userlist = ({ users, modalVisible, setModalVisible }) => {
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        modalContainer: {
            backgroundColor: colors.surface,
            padding: 10,
            margin: 20,
            borderRadius: 5,

        },
        card: {
            margin: 8,
            elevation: 4,

        },
        cardLayout: {

            flexDirection: "row",
            alignItems: "center",


        },
        imageContainer: {
            width: 64,
            height: 64,
            marginHorizontal: 20,
            borderRadius: 100,
            overflow: "hidden",

        },
        cover: {
            width: "100%",
            height: "100%",
        },
        textContainer: {
            flex: 1,
            padding: 10,

        },
        title: {
            fontWeight: "bold",

        },
        button: {
            marginTop: 10,
        },
    });

    return (

        <Portal>
            <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>

                {users?.map((user, index) => (
                    <TouchableOpacity key={index} style={{ marginBottom: 10 }}>
                        <Card>
                            <View style={styles.cardLayout}>
                                <View style={styles.imageContainer}>
                                    <Avatar.Image source={{ uri: `https://api.multiavatar.com/${user.profilePictureUrl || user.displayName}.png` }} style={styles.cover} />

                                </View>
                                <Card.Content>

                                    <Text style={styles.title}>{user.displayName}</Text>

                                </Card.Content>

                            </View>
                        </Card>
                    </TouchableOpacity>
                ))}

                <Button style={styles.button} mode="contained" onPress={() => setModalVisible(false)}>Close</Button>
            </Modal>
        </Portal>
    );
};


export default Userlist