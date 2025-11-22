"server only";

import admin from "../firebase-admin";

export const saveFingerPrint = async (visitorId: string, uid: string) => {
  try {
    await admin.firestore().doc("/fingerprints").create({
      uid,
      visitorId,
    });
  } catch (error) {
    console.error("[SAVE_FINGER_PRINT ERROR]:", error);
  }
};

export const updateFingerPrint = async () => {
  try {
  } catch (error) {
    console.error("[UPDATING_FINGER_PRINT ERROR]:", error);
  }
};
