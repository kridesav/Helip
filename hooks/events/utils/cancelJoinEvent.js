import { firestore } from '../../../config/firebaseConfig';
import { doc, updateDoc, arrayRemove, increment } from 'firebase/firestore';

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
        return true;
    } catch (error) {
        console.error("Error cancelling user participation: ", error);
        return false;
    }
}

export default CancelJoinEvent;

