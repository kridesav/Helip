import { useState, useEffect } from 'react';
import { firestore } from '../../config/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';

export const useRealTimeEvent = (eventId, currentUser) => {
  const [eventData, setEventData] = useState(null);
  
 
  useEffect(() => {
    if (!eventId || currentUser) return;

    const unsubscribe = onSnapshot(doc(firestore, "events", eventId),
      (doc) => {
        if (doc.exists()) {
          setEventData({ id: doc.id, ...doc.data(), isFull: doc.data().participants >= doc.data().participantLimit});
          
        } else {
          setEventData(null);
        }
      }, 
      (error) => {
        console.error("Error listening to event changes:", error);
      });

    return () => unsubscribe();

  }, [eventId]);

  return { eventData };
};
