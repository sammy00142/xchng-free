import { doc, getDoc } from "firebase/firestore";
import admin from "./firebase-admin";
import { db } from "./firebase";

export const getUserByUid = async (uid: string) => {
  try {
    const user = await getDoc(doc(db, "Users", uid));
    return user.data();
  } catch (error) {
    console.error("FETCH USER DATA: ", error);
    return null;
  }
};
