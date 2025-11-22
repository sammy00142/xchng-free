import { NextResponse } from "next/server";
import sharp from "sharp";

export const POST = async (req: Request) => {
  try {
    const { image }: { image: Buffer } = await req.json();

    console.log("IMAGE BUFFER ", image);

    const imageUnit8 = new Uint8Array(image);

    console.log("IMAGE UNIT 8: ", imageUnit8);

    const data = await sharp(imageUnit8).toFormat("webp").toBuffer();

    console.log(data);

    return NextResponse.json({
      message: "Image converted to webp successfully",
      //   data: data,
    });
  } catch (error) {
    console.error("UPLOAD_PROFILE_PICTURE", error);

    return NextResponse.json({
      message: "An error occured while converting image to webp",
    });
  }
};
