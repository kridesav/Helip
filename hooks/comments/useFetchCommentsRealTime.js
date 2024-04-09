import { useEffect, useState } from 'react';
import { firestore } from '../../config/firebaseConfig';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

export function useRealTimeEventComments(eventId, currentUser) {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        if (!eventId || currentUser) return;

        const commentsQuery = query(collection(firestore, "comments"), where("eventId", "==", eventId), orderBy("createdAt", "asc"));

        const unsubscribeComments = onSnapshot(commentsQuery, (querySnapshot) => {
            const unsubscribes = [];

            querySnapshot.docs.forEach(doc => {
                const commentData = { id: doc.id, ...doc.data(), replies: [] };

                const repliesRef = collection(firestore, `comments/${doc.id}/replies`);
                const repliesQuery = query(repliesRef, orderBy("createdAt", "asc"));

                const unsubscribeReplies = onSnapshot(repliesQuery, (repliesSnapshot) => {
                    const replies = repliesSnapshot.docs.map(replyDoc => ({
                        id: replyDoc.id,
                        ...replyDoc.data()
                    }));

                    setComments(currentComments => currentComments.map(comment => {
                        if (comment.id === doc.id) {
                            return { ...comment, replies };
                        }
                        return comment;
                    }));
                });

                unsubscribes.push(unsubscribeReplies);
            });

            setComments(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), replies: [] })));

            return () => unsubscribes.forEach(unsub => unsub());
        });

        return () => unsubscribeComments();
    }, [eventId]);

    return { comments };
}
