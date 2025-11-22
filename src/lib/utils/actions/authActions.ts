"use server";

import {
  GoogleAuthProvider,
  browserLocalPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { FirebaseError } from "firebase-admin";

export const signInCredentials = async (
  url: string | null,
  formData: FormData
) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  let logged = false;

  if (!email || !password) {
    return {
      message: "All fields are required!",
    };
  }

  try {
    await setPersistence(auth, browserLocalPersistence).then(() => {
      console.log("Persistence set");

      return signInWithEmailAndPassword(auth, email, password).then((user) => {
        cookies().set("user", JSON.stringify(user.user.toJSON()));
        logged = true;
      });
    });
  } catch (e) {
    const err = e as FirebaseError;
    console.log(err);
    return {
      message:
        err?.code === "auth/invalid-login-credentials"
          ? "Wrong password or email"
          : err?.code === "auth/user-not-found"
          ? "User not found"
          : err?.code === "auth/wrong-password"
          ? "Wrong password"
          : err.code === "auth/network-request-failed"
          ? "Network request failed"
          : "Something went wrong. Try again",
    };
  }

  if (logged) {
    console.log("Logged", logged);

    // redirect(url || "/sell");
  }

  revalidatePath("/");
};

export const logout = async (url: string) => {
  "use server";
  await signOut(auth);
  redirect(url || "/sell");
};

export const signInWithGoogle = async () => {
  "use server";
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
  redirect(".");
};
