import { firestore } from '../config/firebaseConfig';
import { doc, setDoc, serverTimestamp, collection } from 'firebase/firestore';


export default useAddEvent = () => {
  const addEvent = async (eventData, userId) => {
    const eventRef = doc(collection(firestore, "events"));
    const eventWithUser = { ...eventData, createdBy: userId, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };

    try {
      await setDoc(eventRef, eventWithUser);
      console.log("Event successfully added!");
      return true;
    } catch (error) {
      console.error("Error adding event: ", error);
      return false;
    }
  };

  return addEvent;
};
