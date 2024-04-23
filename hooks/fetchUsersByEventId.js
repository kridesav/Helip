import { firestore } from '../config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const fetchUsersData = async (userIds) => {
    const users = [];
    
    for (const userId of userIds) {
        const userRef = doc(firestore, "users", userId);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            users.push(docSnap.data());
        } else {
            console.log("No such user!");
        }
    }
    return users;
};

export default fetchUsersData