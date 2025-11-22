// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
// import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBaqs5rPeY_5Mol9nq8MOzLhZ5QsdEwL2E",
  authDomain: "greatexchange.co",
  projectId: "great-exchange",
  storageBucket: "great-exchange.appspot.com",
  messagingSenderId: "443106951382",
  appId: "1:443106951382:web:4cb7f93ab5c93d09dd8977",
  measurementId: "G-4HJNCTX5V7",
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
// export const messaging = getMessaging(app);
