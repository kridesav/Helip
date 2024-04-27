import { useEffect, useState } from 'react';
import { firestore } from '../../config/firebaseConfig';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

export function useRealTimeUserComments(userId) {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        if (!userId) {
            return;
        }

        const commentsQuery = query(collection(firestore, "comments"), where("commentedBy", "==", userId), orderBy("createdAt", "asc"));
        let unsubscribes = []; 
        const unsubscribeComments = onSnapshot(commentsQuery, (querySnapshot) => {
      
            querySnapshot.docs.forEach(doc => {
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
        });

        unsubscribes.push(unsubscribeComments); 
        return () => {
            unsubscribes.forEach(unsub => unsub()); 
        };
    }, [userId]);

    return { comments };
}