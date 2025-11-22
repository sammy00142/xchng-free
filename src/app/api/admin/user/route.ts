import { NewType } from "@/app/(admin)/admin/(non-auth)/users/page-cp";
import { db } from "@/lib/utils/firebase";
import admin from "@/lib/utils/firebase-admin";
import { getUserCookie } from "@/lib/utils/getUserCookie";
import { FirebaseError } from "firebase/app";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const uc = await getUserCookie();

  try {
    if (!uc) {
      return NextResponse.json({
        message: "You are not logged in! UC",
        success: false,
        data: null,
      });
    }

    const { todo, uid } = (await request.json()) as {
      uid: string;
      todo: string;
    };
    const userRef = doc(db, "Users", uid);
    const check = await getDoc(userRef);
    const data = check.data() as NewType;

    if (!check.exists()) {
      return NextResponse.json({
        message: "User does not exist. Refresh your browser window.",
        success: false,
      });
    }

    // if (todo === "delete") {
    //   await updateDoc(userRef, {
    //     deleted: data.deleted ? false : true,
    //     disbled: data.deleted ? false : true,
    //   });

    //   if (data.deleted === false) {
    //     await admin.auth().deleteUser(uid);

    //     return NextResponse.json({
    //       message: "User has been deleted.",
    //       success: true,
    //     });
    //   } else {
    //     await admin
    //       .auth()
    //       .createUser({
    //         uid: data.id,
    //         email: data.email,
    //         displayName: data.username,
    //         disabled: false,
    //       })
    //       .then(async (res) => {
    //         await updateDoc(userRef, {
    //           deleted: false,
    //           disabled: false,
    //         });

    //         await admin.auth().updateUser(res.uid, {
    //           photoURL:
    //             data.imageUrl ||
    //             "https://firebasestorage.googleapis.com/v0/b/greatexc.appspot.com/o/logoplace.svg?alt=media&token=ed97e56c-c22f-4f56-b405-d7ee72b1e9f0",
    //         });
    //       });

    //     return NextResponse.json({
    //       message: "User has been restored.",
    //       success: true,
    //     });

    //     // #TODO: add email trigger function here to inform user their account has been re-instated
    //     // requires a Blaze plan on firebase
    //     // or find any free email trigger frameworks
    //   }
    // } else

    if (todo === "disable") {
      if (data.disabled === false) {
        await admin.auth().updateUser(uid, {
          disabled: true,
        });
        await updateDoc(userRef, {
          disabled: true,
        });

        return NextResponse.json({
          message: "User has been disabled.",
          success: true,
        });
      } else {
        await admin.auth().updateUser(uid, {
          disabled: false,
        });

        await updateDoc(userRef, {
          disabled: false,
        });

        return NextResponse.json({
          message: "User has been enabled.",
          success: true,
        });
      }

      // #TODO: add email trigger function here to inform user their account state has changed
      // requires a Blaze plan on firebase
      // or find any free email trigger frameworks
    } else {
      return NextResponse.json({
        message: "Invalid request.",
        success: false,
      });
    }
  } catch (error) {
    console.error("ADMIN MANAGE USER: ", error);

    const firebaseErr = error as FirebaseError;
    console.log(firebaseErr.toString()!);
    return NextResponse.json({
      message:
        firebaseErr.code === "auth/user-not-found"
          ? firebaseErr.message
          : firebaseErr.code === "auth/invalid-photo-url"
          ? "Photo url can not be empty. This is a fatal error. Contact developer."
          : firebaseErr.code === "auth/uid-already-exists"
          ? firebaseErr.message
          : "Internal error occured. Please try again later.",
      success: false,
    });
  }
}
