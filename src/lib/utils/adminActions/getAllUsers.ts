"use server";

import { getAuth } from "firebase-admin/auth";
import { User } from "../../../../types";
import { adminAuth, adminDB } from "../firebase-admin";
import {
  sendNotificationToAdmin,
  sendNotificationToUser,
} from "../sendNotification";

export async function getAllUsers() {
  const snapshot = await adminDB.collection("Users").get();

  const users = snapshot.docs
    .sort((a, b) => a.data().displayName.localeCompare(b.data().displayName))
    .map(async (doc) => {
      const user = await adminAuth.getUser(doc.id);

      const data = doc.data() as User;

      return {
        id: doc.id,
        username: data.displayName,
        isAdmin: data.role === "admin",
        email: data.email,
        image: data.imageUrl,
        role: data.role,
        messages: data.conversations || [],
        transactions: data.transactions || [],
        disabled: user.disabled || false,
        customClaims: user.customClaims,
      };
    });

  return users;
}

export async function getUsersAction(query: string, currentPage: number) {
  const users = await Promise.all(await getAllUsers());
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase())
  );

  const startIndex = (currentPage - 1) * 10;
  const endIndex = startIndex + 10;
  return filteredUsers.slice(startIndex, endIndex);
}

export async function getTotalPagesAction(query: string) {
  const users = await Promise.all(await getAllUsers());
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(query.toLowerCase())
  );

  return Math.ceil(filteredUsers.length / 10);
}

export async function deleteUserAction(uid: string) {
  try {
    await adminDB.collection("Users").doc(uid).delete();

    await adminAuth.deleteUser(uid);

    sendNotificationToUser(uid, {
      title: "Account Deletion",
      body: "Your account has been deleted, you can no longer use our services",
      url: "/sign-in",
    });

    return { message: "User deleted successfully" };
  } catch (error) {
    console.log("Error deleting user", error);
  }
}

export async function banUserAction(uid: string) {
  try {
    await adminDB.collection("Users").doc(uid).update({
      disabled: true,
    });

    await adminAuth.updateUser(uid, {
      disabled: true,
    });

    sendNotificationToUser(uid, {
      title: "Account Security",
      body: "Your account has been disabled due to some security reasons, contact our support team for more information",
      url: "/support",
    });

    return { message: "User banned successfully" };
  } catch (error) {
    console.log("Error banning user", error);
  }
}

export async function unbanUserAction(uid: string) {
  try {
    await adminDB.collection("Users").doc(uid).update({
      disabled: false,
    });

    await adminAuth.updateUser(uid, {
      disabled: false,
    });

    sendNotificationToUser(uid, {
      title: "Congratulations",
      body: "Your account has been re-enabled, you can now login",
      url: "/sign-in",
    });

    return { message: "User unbanned successfully" };
  } catch (error) {
    console.log("Error unbanning user", error);
  }
}

export async function makeAdminAction(uid: string) {
  try {
    await adminDB.collection("Users").doc(uid).update({
      role: "admin",
    });

    await adminAuth.updateUser(uid, {
      disabled: false,
    });

    await adminAuth.setCustomUserClaims(uid, { admin: true });

    const additionalClaims = {
      adminAccount: true,
    };

    const customToken = await adminAuth.createCustomToken(
      uid,
      additionalClaims
    );

    await adminDB.collection("Users").doc(uid).update({
      customToken: customToken,
    });

    const visitorSnapshot = await adminDB
      .collection("visitors")
      .where("uid", "==", uid)
      .get();

    const visitorData = visitorSnapshot.docs[0]?.data();

    if (!visitorData) {
      return { ok: false, message: "User cannot be an admin" };
    }

    await adminDB.collection("allowedAdmins").doc(uid).set(visitorData);

    sendNotificationToUser(uid, {
      title: "Congratulations",
      body: "You have been made an admin",
      url: "/sign-in",
    });

    sendNotificationToAdmin({
      title: "Security Alert",
      body: "A new user has been made an admin. Are you aware of this?",
      url: "/admin/users",
    });

    return { ok: true, message: "Admin created successfully" };
  } catch (error) {
    console.log("Error making admin", error);
    return { ok: false, message: "Error making admin" };
  }
}

export async function removeAdminAction(uid: string, username: string) {
  try {
    await adminDB.collection("Users").doc(uid).update({
      role: "user",
    });

    await adminAuth.updateUser(uid, {
      disabled: false,
    });

    await adminAuth.setCustomUserClaims(uid, { admin: false });

    const additionalClaims = {
      adminAccount: false,
    };

    const customToken = await adminAuth.createCustomToken(
      uid,
      additionalClaims
    );

    await adminDB.collection("Users").doc(uid).update({
      customToken: customToken,
    });

    const adminSnapshot = await adminDB
      .collection("allowedAdmins")
      .where("uid", "==", uid)
      .get();

    if (adminSnapshot.empty || !adminSnapshot.docs[0]) {
      return { ok: false, message: "User is not an admin" };
    }

    await adminDB
      .collection("allowedAdmins")
      .doc(adminSnapshot.docs[0].id)
      .delete();

    sendNotificationToUser(uid, {
      title: "Admin removed",
      body: `You are no longer an admin ${username}`,
      url: "/sign-in",
    });

    sendNotificationToAdmin({
      title: "Security Alert",
      body: `A user has been removed as an admin. Are you aware of this?`,
      url: "/admin/users",
    });

    return { ok: true, message: "Admin removed successfully" };
  } catch (error) {
    console.log("Error removing admin", error);
    return { ok: false, message: "Error removing admin" };
  }
}
