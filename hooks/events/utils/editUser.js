import { firestore } from '../../../config/firebaseConfig';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { Alert } from 'react-native';

export default editUser = () => {
  const editUser = async (userData, userId) => {
    const userRef = doc(firestore, "users", userId);

    const { id, ...updateData } = userData;
    const userWithTimestamp = { ...updateData, updatedAt: serverTimestamp() };

    try {
      await updateDoc(userRef, userWithTimestamp);
      console.log("User successfully modified!");
      Alert.alert(
        "User modified",
        "User was successfully modified",
        [{ text: "OK" }]
      )
      return true;
    } catch (error) {
      console.error("Error modifying user: ", error);
      Alert.alert(
        "Error",
        "There was a problem modifying your user. Please try again.",
        [{ text: "OK" }]
      );
      return false;
    }
  };

  return editUser;
};