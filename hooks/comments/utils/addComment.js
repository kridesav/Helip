import { firestore } from '../../../config/firebaseConfig';
import { doc, setDoc, serverTimestamp, collection, updateDoc, arrayUnion} from 'firebase/firestore';
import { Alert } from 'react-native';

export const addComment= async (commentData, userId, eventId, displayName, firstName) => {
    const commentRef = doc(collection(firestore, "comments"));
    const commentWithUser = { ...commentData,commentedBy: userId, displayName: displayName, firstName: firstName, eventId: eventId, createdAt: serverTimestamp(), updatedAt: serverTimestamp()};

    try {
      await setDoc(commentRef, commentWithUser);
      
      const userRef = doc(firestore, "users", userId);

      await updateDoc(userRef, {
        commentsSent: arrayUnion(commentRef.id)
      });
      
      console.log("Comment successfully added and linked to user!");
      return true;
    } catch (error) {
      console.error("Error adding Comment or linking it to user: ", error);
      Alert.alert(
        "Error",
        "There was a problem sending your Comment. Please try again.",
        [{ text: "OK" }]
      );
      return false;
    }
  };
