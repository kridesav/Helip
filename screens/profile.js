import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function ProfileScreen({ navigation }) {


    return (
        <View style={styles.container}>
            <View style={styles.profileHeader}>
                <Image source={require('../image/sigmachad.jpg')} style={styles.profilePic} />
                <Text style={styles.name}>Sigma Chad</Text>
                <Text style={styles.location}>Helsinki, Finland</Text>
            </View>
            <View style={styles.statsContainer}>
                <View style={styles.stat}>
                    <Text style={styles.statNumber}>15</Text>
                    <Text style={styles.statName}>Groups</Text>
                </View>
                <View style={styles.stat}>
                    <Text style={styles.statNumber}>13</Text>
                    <Text style={styles.statName}>Followers</Text>
                </View>
                <View style={styles.stat}>
                    <Text style={styles.statNumber}>9</Text>
                    <Text style={styles.statName}>Fav. Places</Text>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.followButton}>
                    <Text style={styles.buttonText}>FOLLOW</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.messageButton}>
                    <Text style={styles.buttonText}>SEND MESSAGE</Text>
                </TouchableOpacity>
            </View>
        </View>
        //
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    profileHeader: {
        backgroundColor: '#4B9ED8',
        width: '100%',
        alignItems: 'center',
        paddingVertical: 20,
    },
    profilePic: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderColor: 'white',
        borderWidth: 3,
    },
    name: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
    },
    location: {
        color: 'white',
        fontSize: 16,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        backgroundColor: 'white',
        paddingVertical: 10,
    },
    stat: {
        alignItems: 'center',
    },
    statName: {
        fontSize: 14,
        color: 'black',
    },
    statNumber: {
        fontSize: 24,
        color: 'white',
        backgroundColor: '#4B9ED8',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 50,
        overflow: 'hidden',
        textAlign: 'center',
        width: 50,
        height: 50,
        lineHeight: 30, // Adjust this if your text is not vertically centered
        // Additional styles for layout purposes, if needed:
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%', // Use the full width of the screen
        marginTop: 20,
    },
    followButton: {
        backgroundColor: '#4B9ED8',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        // You might want to add margins if you want to separate the buttons
    },
    messageButton: {
        backgroundColor: '#4B9ED8',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        // You might want to add margins if you want to separate the buttons
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center', // Ensure text is centered within the button
    },
});
