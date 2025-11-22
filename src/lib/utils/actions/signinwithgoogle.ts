import {
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth, db, googleAuthProvider } from "../firebase";
import { FirebaseError } from "firebase/app";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { postToast } from "@/components/postToast";
import Cookies from "js-cookie";
import { redirect } from "next/navigation";

export const signInWithGoogle = async () => {
  try {
    await setPersistence(auth, browserLocalPersistence);

    const signin = await signInWithPopup(auth, googleAuthProvider);

    const _u = signin.user;

    const checkUser = await getDoc(doc(db, "User", _u.uid));

    if (!checkUser.exists()) {
      const userData = {
        displayName: _u.displayName,
        email: _u.email,
        emailVerified: _u.emailVerified,
        phoneNumber: _u.phoneNumber,
        photoURL: _u.photoURL,
        uid: _u.uid,
        metadata: { ..._u.metadata },
        role: "user",
        conversations: [],
        cardChoices: [],
        transactions: [],
      };

      // Save user data to db
      await setDoc(doc(db, "Users", _u.uid), userData);

      Cookies.set("user", JSON.stringify(userData));
    } else {
      Cookies.set("user", JSON.stringify(checkUser.data()));
    }
    postToast("Successfully signed in");

    window.location.href = "/sell";
  } catch (err) {
    const error = err as FirebaseError;
    const errorCode = error.code;
    const errorMessage = error.message;

    const credential = GoogleAuthProvider.credentialFromError(error);

    return {
      error: {
        code: errorCode,
        message: errorMessage,
        credential,
      },
      success: false,
      user: null,
    };
  }
};
