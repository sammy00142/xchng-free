"use server";

import { api } from "@/trpc/server";

export const uploadMedia = async ({
  url,
  fileName,
  size,
  messageId,
  type,
}: {
  url: string;
  fileName: string;
  size: string;
  messageId: string;
  type: string;
}) => {
  try {
    await api.media.upload({
      url,
      fileName,
      size,
      messageId,
      type,
    });
  } catch (error) {
    console.error("[SERVER_ACTION_ERROR]:[UPLOAD_MEDIA]", error);
  }
};
