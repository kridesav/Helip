import { useState, useEffect } from 'react';
import { firestore } from '../config/firebaseConfig';
import { query, collection, where, getDocs } from 'firebase/firestore';

export const useFetchEventsByLocationId = (locationId) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!locationId) {
        setLoading(false);
        return;
      }

      try {
        const q = query(collection(firestore, "events"), where("locationId", "==", locationId));
        const querySnapshot = await getDocs(q);
        const eventsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(eventsArray);
      } catch (error) {
        console.error("Error fetching events by locationId:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [locationId]);

  return { events, loading };
};
