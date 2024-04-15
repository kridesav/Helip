
import { firestore } from '../config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const fetchUserData = async (userId) => {
  const userRef = doc(firestore, "users", userId);
  try {
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.error("No user found for ID:", userId);
      return null;  
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null; 
  }
};

export default fetchUserData;