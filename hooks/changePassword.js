import { getAuth, updatePassword } from "firebase/auth";

export default async function changePassword(newPassword) {
    const auth = getAuth();
    const user = auth.currentUser;
    return updatePassword(user, newPassword);
}