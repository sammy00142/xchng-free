"use server";

import sharp from "sharp";

export const convertImageToWebp = async (inputFile: Uint8Array) => {
  try {
    const data = await sharp(inputFile).toFormat("webp").toBuffer();

    return data;
  } catch (error) {
    console.error("Error converting image to webp: ", error);
  }
};


