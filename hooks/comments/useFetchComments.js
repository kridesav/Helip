import { useState, useEffect } from 'react';
import { firestore } from '../../config/firebaseConfig'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';

export default function useFetchComments(eventId) {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        if (!eventId) return;

        const fetchCommentsAndReplies = async () => {
            const commentsRef = collection(firestore, "comments");
            const q = query(commentsRef, where("eventId", "==", eventId), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);

            const commentsWithRepliesPromises = querySnapshot.docs.map(async (doc) => {
                const commentData = { id: doc.id, ...doc.data() };
                const repliesRef = collection(firestore, `comments/${doc.id}/replies`);
                const repliesQuery = query(repliesRef, orderBy("createdAt", "desc"));
                const repliesSnapshot = await getDocs(repliesQuery);

                const replies = repliesSnapshot.docs.map(replyDoc => ({
                    id: replyDoc.id,
                    ...replyDoc.data()
                }));

                return { ...commentData, replies };
            });

            const commentsWithReplies = await Promise.all(commentsWithRepliesPromises);
            setComments(commentsWithReplies);
        };

        fetchCommentsAndReplies();
    }, [eventId]);

    return { comments };
}


