// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5_RBhQu_CaeuA5--KccGTBStZIL6bQ5k",
  authDomain: "helip-fc23e.firebaseapp.com",
  databaseURL: "https://helip-fc23e-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "helip-fc23e",
  storageBucket: "helip-fc23e.appspot.com",
  messagingSenderId: "211542901631",
  appId: "1:211542901631:web:08fdafeddf510e18ed104a",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
