import { firestore } from '../config/firebaseConfig';
import { useEffect, useState } from 'react';
import { collection, where, documentId,query, onSnapshot } from 'firebase/firestore';

const useFetchUsersData = (userIds) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userIds || userIds.length === 0) {
            setUsers([]); 
            setLoading(false);
            return;
        }

        setLoading(true); 
        const usersRef = collection(firestore, "users");
        const q = query(usersRef, where(documentId(), "in", userIds));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedUsers = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setUsers(fetchedUsers);
            setLoading(false); 
        }, (error) => {
            console.error("Error fetching users: ", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userIds]);

    return { users, loading };
};


export default useFetchUsersData