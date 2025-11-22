import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import admin from "../firebase-admin";
import { db } from "../firebase";
import { NewType } from "@/app/(admin)/admin/(non-auth)/users/page-cp";
import { checkIsAdmin } from "./checkAdmin";

export async function toggleBlockUser(uid: string) {
  try {
    // const isAdmin = await checkIsAdmin().then((res) => res?.isAdmin);

    // if (!isAdmin) {
    //   return {
    //     message: "You are not authorized to perform this action.",
    //     success: false,
    //   };
    // }

    const userRef = doc(db, "Users", uid);
    const check = await getDoc(userRef);
    const data = check.data() as NewType;

    if (!check.exists()) {
      return {
        message: "User does not exist. Refresh your browser window.",
        success: false,
      };
    }

    if (data.disabled === false) {
      await admin.auth().updateUser(uid, {
        disabled: true,
      });
      await updateDoc(userRef, {
        disabled: true,
      });
    } else {
      await admin.auth().updateUser(uid, {
        disabled: false,
      });

      await updateDoc(userRef, {
        disabled: false,
      });
    }

    // #TODO: add email trigger function here to inform user their account state has changed
    // requires a Blaze plan on firebase
    // or find any free email trigger frameworks

    return {
      message: "User blocked successfully.",
      success: true,
    };
  } catch (error) {
    console.error("BLOCK USER ERROR: ", error);
    return {
      message: "An internal error occured. Please try again.",
      success: false,
    };
  }
}

export async function toggleDeleteUser(uid: string) {
  try {
    // const isAdmin = await checkIsAdmin().then((res) => res?.isAdmin);

    // if (!isAdmin) {
    //   return {
    //     message: "You are not authorized to perform this action.",
    //     success: false,
    //   };
    // }

    const userRef = doc(db, "Users", uid);
    const check = await getDoc(userRef);
    const data = check.data() as NewType;

    if (!check.exists()) {
      return {
        message: "User does not exist. Refresh your browser window.",
        success: false,
      };
    }

    await updateDoc(userRef, {
      deleted: data.deleted ? false : true,
    });

    if (data.deleted === false) {
      await admin.auth().deleteUser(uid);
    } else {
      await admin.auth().createUser({
        uid: uid,
        email: data.email,
        displayName: data.username,
        photoURL: data.imageUrl,
        disabled: data.disabled,
      });

      // #TODO: add email trigger function here to inform user their account has been re-instated
      // requires a Blaze plan on firebase
      // or find any free email trigger frameworks
    }

    return {
      message: "",
      success: true,
    };
  } catch (error) {
    console.error("DELETE USER ERROR: ", error);
    return {
      message: "",
      success: false,
    };
  }
}
