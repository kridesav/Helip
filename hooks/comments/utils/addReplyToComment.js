import { firestore } from '../../../config/firebaseConfig';
import { addDoc, serverTimestamp, collection } from 'firebase/firestore';
import { Alert } from 'react-native';

export const addReplyToComment = async (replyData, userId, displayName, firstName, commentId, targetReplyId) => {

    if (!commentId) {
        console.error("CommentId is undefined or not passed correctly.");
        return false;
    }

    if (!targetReplyId) {
        console.error("targetReplyId is undefined or not passed correctly.");
        return false;
    }

    if (!displayName) {
        console.error("displayName is undefined or not passed correctly.");
        return false;
    }

    try {

        const repliesCollectionRef = collection(firestore, `comments/${commentId}/replies`);

        await addDoc(repliesCollectionRef, {
            ...replyData,
            repliedBy: userId,
            targetReplyId: targetReplyId,
            displayName,
            firstName,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        console.log("Reply successfully added and linked to user!", repliesCollectionRef.id);
        return true;
    } catch (error) {
        console.error("Error adding reply: ", error);
        Alert.alert(
            "Error",
            "There was a problem sending your reply. Please try again.",
            [{ text: "OK" }]
        );
        return false;
    }
};

