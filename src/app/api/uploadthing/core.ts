import { cookies } from "next/headers";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import {
  TERMINAL_BgRed,
} from "../../../../terminal";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const OurFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "64MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload

      const uc = cookies().get("user")?.value;

      const user = JSON.parse(uc || "{}"); // Fake auth function

      if (!user) throw new Error(`Cant find user from req: ${req.toString()}`); // client onError will get "Failed to run middleware"
      if (!user.uid) throw new UploadThingError("No user ID"); // client onError will get "No user ID"

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.uid };
    })
    .onUploadError((e) => {
      console.error(TERMINAL_BgRed, "UPLOADTHING ERROR", e);
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof OurFileRouter;
