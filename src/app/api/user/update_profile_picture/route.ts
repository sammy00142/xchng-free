import { db, storage } from "@/lib/utils/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const uc = cookies().get("user");
  if (!uc) {
    return NextResponse.json({ success: false, message: "user_not_found" });
  }
  const user = JSON.parse(uc.value);
  if (!user) {
    return NextResponse.json({ success: false, message: "user_not_found" });
  }

  try {
    const {
      image,
      metadata,
    }: {
      image: string;
      metadata: {
        name: string | undefined;
        size: number | undefined;
        type: string | undefined;
      };
    } = await req.json();

    const storageRef = ref(
      storage,
      `/profile_images/greatexchange.co_${user.id}_${metadata.name}`
    );

    // using fs convert base64 to blob
    const base64Data = image.split(";base64,").pop();
    if (!base64Data) {
      throw new Error("Invalid base64 string");
    }

    const toBlob = Buffer.from(base64Data, "base64");

    const uploadTask = await uploadBytes(storageRef, toBlob, {
      contentType: metadata.type,
    });

    const mediaurl = await getDownloadURL(uploadTask.ref);

    const userRef = doc(db, "Users", user.uid);
    await updateDoc(userRef, {
      imageUrl: mediaurl,
    });

    return NextResponse.json({ url: mediaurl });
  } catch (error) {
    console.error("UPLOAD_PROFILE_PICTURE", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error",
    });
  }
};
