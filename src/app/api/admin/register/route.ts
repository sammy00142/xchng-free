import { auth, db } from "@/lib/utils/firebase";
import admin from "@/lib/utils/firebase-admin";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    //   get passed credentials
    const { email, password, username } = (await req.json()) as {
      email: string;
      password: string;
      username: string;
      visitorId: string;
    };

    //   create user
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    //   make user an admin
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });

    //   save user to firestore
    const userData = {
      email: user.email,
      displayName: user.displayName || username || "username",
      photoURL: user.photoURL || "",
      uid: user.uid,
      role: "admin",
    };

    await setDoc(doc(db, "Users", user.uid), userData);
    //   save user data to cookies
    await setDoc(doc(db, "allowedAdmins", user.uid), {
      uid: user.uid,
      username: user.displayName || username || "username",
      disabled: false,
      fingerprintId: null,
    });

    //   log user in
    await signInWithEmailAndPassword(auth, email, password);

    return NextResponse.json({
      message: "Admin created successfully",
      login: true,
      user: user.toJSON(),
    });
  } catch (error) {
    const err = error as FirebaseError;
    let message = err.message;
    console.log("ADMIN REGISTER ERROR: ", error);

    return NextResponse.json({ message: message, login: false, user: null });
  }
}
