import React from "react";
import { Text, View, StyleSheet, Image } from "react-native";

const FeedEvent = () => {
    return(
        <View style={styles.container}>
            <View style={styles.inner_left}>
                <Image source={require('../assets/Icons/circle/baseball.png')} />
            </View>
            <View style={styles.inner_middle}>
                <View style={styles.inner_middle_top}>
                    <View>
                        <Text>Header</Text>
                    </View>
                    <View>
                        <Text>DateTime</Text>
                    </View>
                </View>
                <View>
                    <Text>Location</Text>
                </View>
            </View>
            <View style={styles.inner_right}>
                <Image source={require('../assets/Icons/circle/baseball.png')} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '360px',
        height: '80px',
        marginTop: '20px',
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center'
    },
    inner_left: {
        width: '25%'
    },
    inner_middle: {
        width: '50%',
        display: 'flex'
    },
    inner_middle_top: {
        display: 'flex',
        flexDirection: 'row'
    },
    inner_right: {
        width: '25%'
    }
})

export default FeedEvent