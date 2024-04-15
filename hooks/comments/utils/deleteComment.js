import { firestore } from '../../../config/firebaseConfig';
import { doc, updateDoc } from "firebase/firestore";
import { Alert } from 'react-native';

export default async function softDeleteComment(commentId) {
    if (!commentId) {
        console.error("Invalid commentId or userId");
        Alert.alert("Error", "Missing comment ID or user ID. Please try again.", [{ text: "OK" }]);
        return false;
    }

    try {
        const commentRef = doc(firestore, "comments", commentId);
        await updateDoc(commentRef, {
          deleted: true,
          content: "This comment was deleted."
        });
        console.log("Comment marked as deleted.");
        Alert.alert("Comment Deleted", "The comment has been marked as deleted.", [{ text: "OK" }]);
        return true;
      } catch (error) {
        console.error("Error marking comment as deleted", error);
        Alert.alert("Error", "Failed to delete the comment. Please try again.", [{ text: "OK" }]);
        return false;
      }
    }