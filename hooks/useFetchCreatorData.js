import { useState, useEffect } from 'react';
import { firestore } from '../config/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';

const useFetchCreatorData = (userId) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!userId) {
      setUserData(null);
      return;
    }

    const userRef = doc(firestore, "users", userId);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
       
        const data = doc.data();
        setUserData({
          id: doc.id,
          profilePictureUrl: data.profilePictureUrl,
          firstName: data.firstName,
          displayName: data.displayName,
          ...data 
        });
      } else {
        console.error("No such user!");
        setUserData(null);
      }
    }, (error) => {
      console.error("Error listening to user changes:", error);
      setUserData(null);
    });


    return () => unsubscribe();

  }, [userId]); 

  return userData; 
};

export default useFetchCreatorData