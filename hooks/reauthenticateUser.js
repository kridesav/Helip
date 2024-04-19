import { getAuth, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";

export default async function reauthenticateUser(email, password) {
    const auth = getAuth();
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(email, password);
    return reauthenticateWithCredential(user, credential);
}
