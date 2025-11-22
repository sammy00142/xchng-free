import { adminDB } from "@/lib/utils/firebase-admin";
import { getTypedUserCookie } from "@/lib/utils/getUserCookie";
import { NextResponse } from "next/server";

export async function POST() {
  const u = await getTypedUserCookie();

  if (!u) {
    return NextResponse.json({
      isAdmin: false,
      login: true,
    });
  }

  const querySnapshot = await adminDB
    .collection("allowedAdmins")
    .where("uid", "==", u.uid)
    .limit(1)
    .get();

  const doc = querySnapshot.docs[0];

  if (!doc) {
    return NextResponse.json({
      isAdmin: false,
      login: false,
    });
  }

  if (doc.data()?.disabled) {
    return NextResponse.json({
      isAdmin: false,
      login: false,
    });
  }

  return NextResponse.json({
    isAdmin: true,
    login: false,
  });
}
