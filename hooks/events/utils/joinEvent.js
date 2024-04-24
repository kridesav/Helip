import { firestore } from '../../../config/firebaseConfig';
import { doc, arrayUnion, runTransaction } from 'firebase/firestore';

const joinEvent = async (eventId, userId) => {
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
            if (usersParticipating.includes(userId)) {
                throw "User already participating!";
            }

            transaction.update(eventRef, {
                usersParticipating: arrayUnion(userId),
                participants: usersParticipating.length + 1
            });

            transaction.update(userRef, {
                eventsParticipating: arrayUnion(eventId)
            });
        });

        console.log("User joined successfully.");
        return true;
    } catch (error) {
        console.error("Error joining the event: ", error);
        return false;
    }
};

export default joinEvent;