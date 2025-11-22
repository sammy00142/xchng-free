import { auth } from "@clerk/nextjs/server";
import type { Roles } from "../../../types/global";

export const checkRole = (role: Roles) => {
  const { sessionClaims } = auth();
  return sessionClaims?.metadata.role === role;
};
