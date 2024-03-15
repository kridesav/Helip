import { firestore } from '../../../config/firebaseConfig';
import { doc, updateDoc, arrayRemove, increment } from 'firebase/firestore';
import { Alert } from 'react-native';

const CancelJoinEvent = async (eventId, userId) => {
    const eventRef = doc(firestore, "events", eventId);
    const userRef = doc(firestore, "users", userId);
    try {
        await updateDoc(eventRef, {
            participants: increment(-1),
            usersParticipating: arrayRemove(userId),
        });
        await updateDoc(userRef, {
            eventsParticipating: arrayRemove(eventId)
        });
        console.log("User participation cancelled successfully.");
        Alert.alert(
            "Participation Canceled",
            "Your participation to the event was cancelled successfully",
            [{ text: "OK" }]
          )
        return true;
    } catch (error) {
        console.error("Error canceling user participation: ", error);
        Alert.alert(
            "Error",
            "There was a problem in canceling your participation in the event. Please try again.",
            [{ text: "OK" }]
          )
        
        return false;
    }
}

export default CancelJoinEvent;

