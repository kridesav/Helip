import React, { createContext, useEffect, useState } from 'react';
import { firestore } from '../config/firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [Users, setUsers] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(firestore, "users"), (querySnapshot) => {
            const UsersArray = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setUsers(UsersArray);
        });

        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={Users}>
            {children}
        </UserContext.Provider>
    );
};