
import { firestore } from '../../../config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export const fetchEventById = async (eventId) => {
  if (!eventId) return null;

  try {
      const docRef = doc(firestore, "events", eventId);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
          return { id: docSnapshot.id, ...docSnapshot.data() };
      } else {
          console.log("No event found with the given ID.");
          return null;
      }
  } catch (error) {
      console.error("Error fetching event by ID:", error);
      return null;
  }
};
