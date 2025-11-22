"use server";
import admin from "firebase-admin";
import { UserCredential } from "firebase/auth";

export const setCustomAdmin = async (user: UserCredential) => {
  admin.auth().setCustomUserClaims(user.user.uid, {
    admin: true,
  });
};
