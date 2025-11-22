import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECTID,
      privateKey: process.env.FIREBASE_PRIVATEKEY?.replace(/\\n/g, "\n"),
      clientEmail: process.env.FIREBASE_CLIENTEMAIL,
    }),
    databaseURL: process.env.FIREBASE_DATABASEURL,
  });
}

export const adminDB = admin.firestore();
export const adminAuth = admin.auth();
export default admin;
