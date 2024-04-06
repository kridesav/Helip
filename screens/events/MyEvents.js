import useAuth from '../../hooks/useAuth';
import { StyleSheet } from 'react-native';
import { View } from 'react-native';
import FeedEvent from '../../components/FeedEvent';

const MyEvents = () => {

    const { currentUser } = useAuth();
    const userId = currentUser?.uid;

    return(
        <View>
            <FeedEvent />
        </View>
    )

}

const styles = StyleSheet.create({})

export default MyEvents