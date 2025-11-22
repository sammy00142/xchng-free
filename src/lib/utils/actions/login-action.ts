"use server";

import { auth, db } from "@/lib/utils/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import { cookies as cookieStore } from "next/headers";

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, message: "All fields are required" };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userRef = doc(db, "Users", userCredential.user.uid);
    const userDoc = await getDoc(userRef);

    const checkedUser = userDoc.data() as { role?: string };

    if (checkedUser.role !== "admin") {
      cookieStore().set("user", JSON.stringify(checkedUser), {
        secure: process.env.NODE_ENV === "production" ? true : false,
        priority: "high",
        expires: new Date().getTime() + 1000 * 60 * 60 * 24 * 14,
      });

      cookieStore().set("state", "true", {
        secure: process.env.NODE_ENV === "production" ? true : false,
        priority: "high",
        expires: new Date().getTime() + 1000 * 60 * 60 * 24 * 14,
      });

      return {
        success: true,
        message: "Logged in as a regular user. Admin access denied.",
        isAdmin: false,
      };
    }

    if (!userDoc.exists()) {
      const userData = {
        displayName: userCredential.user.displayName,
        email: userCredential.user.email,
        emailVerified: userCredential.user.emailVerified,
        phoneNumber: userCredential.user.phoneNumber,
        photoURL: userCredential.user.photoURL,
        uid: userCredential.user.uid,
        metadata: { ...userCredential.user.metadata },
        role: "user",
        conversations: [],
        cardChoices: [],
        transactions: [],
      };
      await setDoc(userRef, userData);
    }

    // Set cookies
    cookieStore().set("user", JSON.stringify(checkedUser), {
      secure: process.env.NODE_ENV === "production" ? true : false,
      priority: "high",
      expires: new Date().getTime() + 1000 * 60 * 60 * 24 * 14,
    });

    cookieStore().set("state", "true", {
      secure: process.env.NODE_ENV === "production" ? true : false,
      priority: "high",
      expires: new Date().getTime() + 1000 * 60 * 60 * 24 * 14,
    });

    return { success: true, isAdmin: userDoc.data()?.role === "admin" };
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      message: error.message || "An error occurred during login",
    };
  }
}
