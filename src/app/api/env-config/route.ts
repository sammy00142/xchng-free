import getConfig from "next/config";
import { NextResponse } from "next/server";

export function GET() {
  const { publicRuntimeConfig } = getConfig();
  return NextResponse.json(
    {
      NEXT_PUBLIC_VAPID_PUBLIC_KEY:
        publicRuntimeConfig.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    },
    { status: 200 }
  );
}
