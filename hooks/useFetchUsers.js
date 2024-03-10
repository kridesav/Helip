import { useState, useEffect } from 'react';
import { firestore } from '../config/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

export const useFetchUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, "users"));
        const usersArray = querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
        setUsers(usersArray);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading };
};
