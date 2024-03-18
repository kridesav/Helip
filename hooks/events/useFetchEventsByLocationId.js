import { useState, useEffect } from 'react';
import { firestore } from '../../config/firebaseConfig';
import { query, collection, where, onSnapshot } from 'firebase/firestore';

export const useFetchEventsByLocationId = (locationId) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!locationId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(collection(firestore, "events"), where("locationId", "==", locationId));
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const eventsArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        isFull: doc.data().participants >= doc.data().participantLimit
      }));
      setEvents(eventsArray);
      console.log(eventsArray);
      setLoading(false);
    }, error => {
      console.error("Error fetching events by locationId:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [locationId]);

  return { events, loading };
};