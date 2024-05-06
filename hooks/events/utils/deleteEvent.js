import { firestore } from '../../../config/firebaseConfig';
import { doc, deleteDoc, arrayRemove, updateDoc } from "firebase/firestore";
import { Alert } from 'react-native';

export default deleteEvent = async (eventId, userId) => {
  try {
    const eventRef = doc(firestore, "events", eventId);
    await deleteDoc(eventRef);

    const userRef = doc(firestore, "users", userId);

    await updateDoc(userRef, {
      eventsParticipating: arrayRemove(eventId)
    });
    console.log("Event successfully removed and user unlinked!");
    Alert.alert(
      "Event removed",
      "Event was successfully removed",
      [{ text: "OK" }]
    )
    return true;
  } catch (error) {
    console.error("Error removing event or unlinking it to user: ", error);
    Alert.alert(
      "Error",
      "There was a problem removing your event. Please try again.",
      [{ text: "OK" }]
    );
    return false;
  }
};