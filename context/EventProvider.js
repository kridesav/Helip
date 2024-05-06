import React, { createContext, useEffect, useState } from 'react';
import { firestore } from '../config/firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(firestore, "events"), (querySnapshot) => {
            const eventsArray = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                isFull: doc.data().participantLimit <= (doc.data().participants?.length || 0),
            }));
            setEvents(eventsArray);
        });

        return () => unsubscribe();
    }, []);

    return (
        <EventContext.Provider value={events}>
            {children}
        </EventContext.Provider>
    );
};