import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

export const useIsEventCreator = (eventCreatedBy) => {
    const [isCreator, setIsCreator] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            setIsCreator(user.uid === eventCreatedBy);
        }
    }, [eventCreatedBy]);

    return isCreator;
};
