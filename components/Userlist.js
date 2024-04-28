import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Card, Modal, Portal, Text, Button, useTheme, Avatar } from "react-native-paper";
import ProfileModal from "./UserProfileModal";

const Userlist = ({ users, modalVisible, setModalVisible }) => {
    const { colors } = useTheme();
    const [selectedUser, setSelectedUser] = useState([])
    const [subModalVisible, setSubModalVisible] = useState(false)

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


    const handleShowProfile = (user) => {
        setSelectedUser(user);
        setSubModalVisible(true);
    };

    return (

        <Portal>
            <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}
              animationType="slide"
              transparent={true}
              onRequestClose={() => {
                setModalVisible(!ModalVisible);
              }}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                    {users?.map((user, index) => (
                        <TouchableOpacity key={index} style={{ marginBottom: 10 }} onPress={() => handleShowProfile(user)}>
                            <Card>
                                <View style={styles.cardLayout}>
                                    <View style={styles.imageContainer}>
                                        <Avatar.Image source={{ uri: `https://api.multiavatar.com/${user.profilePictureUrl || user.displayName}.png` }} style={styles.cover} />
                                    </View>
                                    <Card.Content>
                                        <Text style={styles.title}>{user?.displayName ? user.displayName : (user?.firstName ? user.firstName : "no name")}</Text>
                                    </Card.Content>
                                </View>
                            </Card>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <Button style={styles.button} mode="contained" onPress={() => setModalVisible(false)}>Close</Button>
            </Modal>
            {selectedUser && (
                <ProfileModal
                    selectedUser={selectedUser}
                    subModalVisible={subModalVisible}
                    setSubModalVisible={setSubModalVisible}
                />
            )}
        </Portal>


    );
};


export default Userlist