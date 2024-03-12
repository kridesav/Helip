import { firestore } from '../../../config/firebaseConfig';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { Alert } from 'react-native';

export default useEditEvent = () => {
  const editEvent = async (eventData, userId) => {
    const eventRef = doc(firestore, "events", eventData.id);

    const { id, ...updateData } = eventData;
    const eventWithUser = { ...updateData, createdBy: userId, updatedAt: serverTimestamp() };


    try {

      await updateDoc(eventRef, eventWithUser);
      console.log("Event successfully modified!");
      return true;
    } catch (error) {
      console.error("Error modifying event: ", error);
      Alert.alert(
        "Error",
        "There was a problem modifying your event. Please try again.",
        [{ text: "OK" }]
      );
      return false;
    }
  };

  return editEvent;
};