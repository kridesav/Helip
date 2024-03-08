import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { firestore } from '../../config/firebaseConfig';

export default useEventDetails = (eventId) => {
    const [eventDetails, setEventDetails] = useState(null);
    const [isEventFull, setIsEventFull] = useState(false);

    useEffect(() => {
        if (!eventId) return;

        const unsubscribe = onSnapshot(doc(firestore, "events", eventId), (doc) => {
            if (doc.exists()) {
                const eventData = { id: doc.id, ...doc.data() };
                setEventDetails(eventData);
                setIsEventFull(eventData.participants >= eventData.participantLimit);
            } else {
                console.log("No such event!");
                setEventDetails(null);
                setIsEventFull(false);
            }
        }, (error) => {
            console.error("Error getting event details:", error);
        });

        return () => unsubscribe();
    }, [eventId]);

    return { eventDetails, isEventFull };
};
