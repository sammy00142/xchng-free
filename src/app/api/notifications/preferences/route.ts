import { adminDB } from "@/lib/utils/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const { preferences, userId } = await request.json();

    await adminDB.collection("Users").doc(userId).update({
      preferences,
    });

    return NextResponse.json("Success", { status: 200 });
  } catch (error) {
    console.error(error);
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const userId = await req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          message: "User id parameter absent!",
          subscribed: false,
          data: null,
        },
        { status: 400 }
      );
    }

    const doc = await adminDB.collection("Users").doc(userId).get();

    if (!doc.exists) {
      return NextResponse.json(
        { subscribed: false, data: null, message: "User doc not found" },
        { status: 404 }
      );
    }

    if (doc.data()!.preferences) {
      return NextResponse.json(
        {
          subscribed: true,
          data: doc.data()!.preferences,
          message: "User subscribed!",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          subscribed: false,
          data: null,
          message: "User is not subscribed yet",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return NextResponse.json(
      { subscribed: false, data: null, message: "Internal server error" },
      { status: 500 }
    );
  }
};
