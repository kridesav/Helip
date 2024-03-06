import { firestore } from '../../config/firebaseConfig';
import { doc, setDoc, serverTimestamp, collection, updateDoc, arrayUnion} from 'firebase/firestore';
import { Alert } from 'react-native';

export default useAddEvent = () => {
  const addEvent = async (eventData, userId) => {
    const eventRef = doc(collection(firestore, "events"));
  
    const eventWithUser = { ...eventData, createdBy: userId, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };

    try {
      await setDoc(eventRef, eventWithUser);
     
      const userRef = doc(firestore, "users", userId);

      await updateDoc(userRef, {
        eventsCreated: arrayUnion(eventRef.id)
      });
      console.log("Event successfully added and linked to user!");
      return true;
    } catch (error) {
      console.error("Error adding event or linking it to user: ", error);
      Alert.alert(
        "Error",
        "There was a problem adding your event. Please try again.",
        [{ text: "OK" }]
      );
      return false;
    }
  };

  return addEvent;
};
