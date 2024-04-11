import { firestore } from '../../../config/firebaseConfig';
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { Alert } from 'react-native';

export default editComment = () => {
  const editComment = async (commentData, userId) => {
    const commentRef = doc(firestore, "comments", CommentData.id);

    const { id, ...updateData } = commentData;
    const commentWithUser = { ...updateData, createdBy: userId, updatedAt: serverTimestamp() };

    try {

      await updateDoc(commentRef, commentWithUser);
      console.log("Comment successfully modified!");
      Alert.alert(
        "Comment modified",
        "Comment was successfully modified",
        [{ text: "OK" }]
      )
      return true;
    } catch (error) {
      console.error("Error modifying Comment: ", error);
      Alert.alert(
        "Error",
        "There was a problem modifying your Comment. Please try again.",
        [{ text: "OK" }]
      );
      return false;
    }
  };

  return editComment;
};