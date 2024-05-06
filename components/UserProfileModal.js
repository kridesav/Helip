import React from "react";
import { View, StyleSheet, ScrollView} from "react-native";
import { Card, Modal, Portal, Text, Button, useTheme, Avatar, Surface } from "react-native-paper";

const ProfileModal = ({ selectedUser, subModalVisible, setSubModalVisible }) => {
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        modalContainer: {
            backgroundColor: colors.surface,
            padding: 5,
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

        description: {
            marginTop: 20,
            flex: 1,
            textAlignVertical: "top",
            marginBottom: 20,
            fontSize: 18,
          },
        button: {
            marginTop: 10,

        },
        nameText: {
            fontWeight: "bold",
            fontSize: 20,
            marginTop: 10,
            
        },
        nameSubText: {
            fontSize: 14,
            marginTop: 2,
        },
      
    });




    return (
        <Portal>
            <Modal visible={subModalVisible} onDismiss={() => setSubModalVisible(false)} contentContainerStyle={styles.modalContainer}
                animationType="slide"
                transparent={true}
                onRequestClose={() => {
                    setSubModalVisible(!subModalVisible);
                }}>
                <Surface elevation={1} >
                    <View style={{ padding: 10 }}>
                        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                            <View style={{ padding: 10, alignItems: "center" }}>
                                <View style={styles.imageContainer}>
                                    <Avatar.Image source={{ uri: `https://api.multiavatar.com/${selectedUser?.profilePictureUrl || selectedUser?.displayName}.png` }} style={styles.cover} />
                                </View>
                            </View>
                            <Card style={{ alignItems: "center" }}>
                                <View style={styles.cardLayout}>
                                    <Card.Content>
                                        <View>
                                            <Text style={styles.nameText}>{selectedUser?.displayName ?? "No display name"}</Text>
                                            <Text style={styles.nameSubText}>
                                                {selectedUser?.firstName ?? "No first name"}, {selectedUser?.lastName ?? "No last name"}
                                            </Text>
                                            <Text style={styles.nameSubText}>{selectedUser?.email ?? "No email"}</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.description}>{selectedUser?.description ?? "No description"}</Text>
                                        </View>
                                    </Card.Content>
                                </View>
                            </Card>
                        </ScrollView>
                        <Button style={styles.button} mode="contained" onPress={() => setSubModalVisible(false)}>Close</Button>
                    </View>
                </Surface>
            </Modal>
        </Portal>

    );
};


export default ProfileModal