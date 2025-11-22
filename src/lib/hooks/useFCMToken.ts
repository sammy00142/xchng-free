// import { useEffect, useState } from "react";
// import { getToken } from "firebase/messaging";
// import { messaging } from "../utils/firebase";

// export const useFCMToken = () => {
//   const [token, setToken] = useState("");
//   const [permission, setPermission] = useState("");

//   useEffect(() => {
//     const retrieveToken = async () => {
//       try {
//         if (
//           navigator &&
//           typeof window !== "undefined" &&
//           "serviceWorker" in navigator
//         ) {
//           // retrieve notification permission
//           const permission = await Notification.requestPermission();
//           setPermission(permission);
//           // initialize messaging service
//           if (permission === "granted") {
//             const currToken = await getToken(messaging, {
//               vapidKey: "YOUR_VAPID_KEY",
//             });

//             if (currToken) {
//               setToken(currToken);
//             } else {
//               console.log(
//                 "No registration token found. request permission to generate"
//               );
//             }
//           }
//         }
//       } catch (error) {
//         console.error("ERROR RETRIEVING NOTIFICATION PERMISSION: hook", error);
//       }
//     };
//   }, []);

//   return { token, permission };
// };
