"use server";

import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../firebase";
import { cookies } from "next/headers";
import type { User } from "firebase/auth";

interface ImageBuffer {
  name: string;
  type: string;
  data: string;
}

interface SendImageResponse {
  message: string;
  done: boolean;
  failed: boolean;
}

export const sendImage = async (e: FormData) => {
  try {
    const cachedUser = cookies().get("user")?.value;
    const user = cachedUser ? (JSON.parse(cachedUser) as User) : null;

    const message = e.get("message");
    const id = e.get("id");
    const image = e.get("image") as File;

    if (!id || !image) {
      return {
        message: "An Id and image are required",
        done: false,
        failed: true,
      };
    }

    const storageRef = ref(
      storage,
      `/cardImages/www.greatexchange.co---${user?.uid}---${id}---${image.name}`
    );

    await uploadBytes(storageRef, image);

    // const url = await getDownloadURL(storageRef);

    // const userMessageData = {
    //   timeStamp: new Date(),
    // };

    // const userMessagePayload = {
    //   caption: (message as string) || "",
    //   url,
    //   metadata: {
    //     media_name: uploadImage.metadata.name,
    //     media_type: uploadImage.metadata.contentType as string,
    //     media_size: uploadImage.metadata.size as number,
    //   },
    // };

    // const res = await sendUserMessage(
    //   userMessageData,
    //   id?.toString() as string,
    //   undefined,
    //   userMessagePayload,
    //   true
    // );

    // if (res?.success) {
    //   return {
    //     message: "Image sent",
    //     done: true,
    //     failed: false,
    //   };
    // } else {
    //   console.error("ERROR AT SERVER ACTION", res?.error);
    //   return {
    //     message: res?.error || "Failed to send image",
    //     done: false,
    //     failed: true,
    //   };
    // }
  } catch (error) {
    console.error("ERROR AT SERVER ACTION", error);
    return {
      message: "An unexpected error occurred",
      done: false,
      failed: true,
    };
  }
};
