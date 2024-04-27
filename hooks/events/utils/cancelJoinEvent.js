import { firestore } from '../../../config/firebaseConfig';
import { doc, arrayRemove, runTransaction } from 'firebase/firestore';


const CancelJoinEvent = async (eventId, userId) => {
    const eventRef = doc(firestore, "events", eventId);
    const userRef = doc(firestore, "users", userId);

    try {
        await runTransaction(firestore, async (transaction) => {
            const eventDoc = await transaction.get(eventRef);
            if (!eventDoc.exists()) {
                throw "Event does not exist!";
            }

            const userData = eventDoc.data();
            const usersParticipating = userData.usersParticipating || [];
            if (!usersParticipating.includes(userId)) {
                throw "User not participating!";
            }

            transaction.update(eventRef, {
                usersParticipating: arrayRemove(userId),
                participants: usersParticipating.length - 1
            });

            transaction.update(userRef, {
                eventsParticipating: arrayRemove(eventId)
            });
        });

        console.log("User canceled join successfully.");
        return true;
    } catch (error) {
        console.error("Error canceling join: ", error);
        return false;
    }
};


export default CancelJoinEvent;
