import { useState, useEffect } from 'react';
import { firestore } from '../../config/firebaseConfig'
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';

export default function useFetchComments(eventId) {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        if (!eventId) return;

        const commentsRef = collection(firestore, "comments");
        const q = query(commentsRef, where("eventId", "==", eventId), orderBy("createdAt", "desc"));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const commentsArray = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setComments(commentsArray);
        });

        return () => unsubscribe();
    }, [eventId]);

    return { comments };
}