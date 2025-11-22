import { postToast } from "@/components/postToast";
import { FirebaseError } from "firebase/app";

const useErrorHandler = () => {
  const handleFirebaseError = (error: any) => {
    console.error("UPDATE_PROFILE", error);
    const err = error as FirebaseError;

    postToast("Update failed!", {
      description:
        err?.code === "auth/user-not-found"
          ? "Waoh! Seems like user is a ghost. They don't exists on out records."
          : err.code === "auth/network-request-failed"
          ? "Network request failed❌. Seems like village people at work🏗️."
          : err.code === "auth/too-many-requests"
          ? "You don try this thing too much. Chill abeg. Try again in a minute or two."
          : "Something went wrong. Try again",
    });
  };

  return { handleFirebaseError };
};

export default useErrorHandler;
