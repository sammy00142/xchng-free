// import { applyWSSHandler } from "@trpc/server/adapters/ws";
// import { WebSocketServer } from "ws";
// import { appRouter, createCaller } from "./api/root";

// const wss = new WebSocketServer({
//   port: 3001,
// });

// const handler = applyWSSHandler({
//   wss,
//   router: appRouter,
//   createContext: createCaller,
//   // Enable heartbeat messages to keep connection open (disabled by default)
//   keepAlive: {
//     enabled: false,
//     // server ping message interval in milliseconds
//     pingMs: 30000,
//     // connection is terminated if pong message is not received in this many milliseconds
//     pongWaitMs: 5000,
//   },
// });

// wss.on("connection", (ws) => {
//   console.log(`➕➕ Connection (${wss.clients.size})`);
//   ws.on("error", (error) => {
//     console.error("WebSocket error:", error);
//   });
//   ws.once("close", (code) => {
//     console.log(`➖➖ Connection (${wss.clients.size}), Code: ${code}`);
//   });
// });

// wss.on("error", (error) => {
//   console.error("WebSocket server error:", error);
// });

// process.on("SIGTERM", () => {
//   console.log("SIGTERM");
//   handler.broadcastReconnectNotification();
//   wss.close();
// });
