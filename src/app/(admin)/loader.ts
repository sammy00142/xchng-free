import { auth, db } from "@/lib/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { redirect } from "next/navigation";

export async function adminLoader() {
  // Check if user is authenticated
  const isAuthenticated = !!auth.currentUser;

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    redirect("/sign-in");
  }

  // Check if user has admin privileges
  const ref = doc(db, "Users", auth?.currentUser?.uid as string);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    redirect("/sign-in");
  }

  // If authenticated and has admin privileges, proceed
  return true;
}
