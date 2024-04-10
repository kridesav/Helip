import { useState, useEffect } from 'react';
import { firestore } from '../config/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export const useFetchCurrentUserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      const docRef = doc(firestore, "users", currentUser.uid);

      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setProfile({ uid: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such document!");
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  return { profile, loading };
};
