import { useState, useEffect } from 'react';
import { firestore } from '../../config/firebaseConfig'
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default useFetchComments = (eventId) => {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const q = query(collection(firestore, "comments"), where("eventId", "==", eventId));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const commentsArray = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setComments(commentsArray);
        });

        return () => unsubscribe();
    }, [eventId]);

    return { comments };
};

