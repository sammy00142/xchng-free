"use server";
import { checkRole } from "@/lib/utils/role";

export const isAdmin = async () => {
  return checkRole("admin");
};
