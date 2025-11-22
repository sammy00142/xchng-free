import admin, { adminDB } from "@/lib/utils/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

const getParams = async (request: NextRequest) => {
  const params = request.nextUrl.searchParams.get("uid") as string;
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(params);
    }, 12)
  );
};

export async function GET(request: NextRequest): Promise<NextResponse> {
  console.log("💳 Validating user...");

  const uid = (await getParams(request)) as string;

  try {
    if (!uid) {
      throw Error("UID parameter is missing");
    }

    const userRecord = await admin.auth().getUser(uid);

    const userDoc = (
      await adminDB.collection("Users").doc(uid).get()
    ).data() as { customToken: string };

    if (!userRecord || !userDoc) {
      return NextResponse.json({
        user: null,
        isAdmin: false,
      });
    }

    // const claims = userRecord.customClaims;

    // if (claims?.admin) {
    //   return NextResponse.json({
    //     user: JSON.stringify(userRecord),
    //     isAdmin: true,
    //   });
    // } else {
    //   return NextResponse.json({
    //     user: null,
    //     isAdmin: false,
    //   });
    // }

    return NextResponse.json({
      user: JSON.stringify(userRecord),
      isAdmin: true,
    });
  } catch (error) {
    console.error("VALIDATE ADMIN ERROR: ", error);
    return NextResponse.json({
      user: null,
      isAdmin: false,
    });
  }
}
