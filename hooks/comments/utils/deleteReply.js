import { firestore } from '../../../config/firebaseConfig';
import { doc, updateDoc } from "firebase/firestore";
import { Alert } from 'react-native';

export default async function softDeleteReply(replyId, commentId) {
    if (!commentId || !replyId) {
        console.error("Invalid commentId or replyId");
        Alert.alert("Error", "Missing comment ID or reply ID. Please try again.", [{ text: "OK" }]);
        return false;
    }

    try {
        const replyRef = doc(firestore, `comments/${commentId}/replies`, replyId);
        await updateDoc(replyRef, {
          deleted: true,
          content: "This reply was deleted."
        });
        console.log("Reply marked as deleted.");
        Alert.alert("Reply Deleted", "The reply has been marked as deleted.", [{ text: "OK" }]);
        return true;
      } catch (error) {
        console.error("Error marking reply as deleted", error);
        Alert.alert("Error", "Failed to delete the reply. Please try again.", [{ text: "OK" }]);
        return false;
      }
    }