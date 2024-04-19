import { getAuth, deleteUser } from "firebase/auth";

export default async function deleteUserAccount() {
    const auth = getAuth();
    const user = auth.currentUser;
    return deleteUser(user);
}

