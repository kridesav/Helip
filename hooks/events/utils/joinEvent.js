import { firestore } from '../../../config/firebaseConfig';
import { doc, updateDoc, arrayUnion, increment } from 'firebase/firestore';

const joinEvent = async (eventId, userId) => {
    const eventRef = doc(firestore, "events", eventId);
    const userRef = doc(firestore, "users", userId);
    try {
        await updateDoc(eventRef, {
            participants: increment(1),
            usersParticipating: arrayUnion(userId),
        });
        await updateDoc(userRef, {
            eventsParticipating: arrayUnion(eventId)
        });
        console.log("User joined successfully.");
        return true;
    } catch (error) {
        console.error("Error joining the event: ", error);
        return false;
    }
};

export default joinEvent;