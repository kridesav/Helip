import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

export const useIfUserJoined = (usersParticipating) => {
    const [isUser, setIsUser] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (user && usersParticipating) {
            setIsUser(usersParticipating.includes(user.uid));
       
        } else {
            setIsUser(false);
        }
    }, [usersParticipating]);

    return isUser;
};
