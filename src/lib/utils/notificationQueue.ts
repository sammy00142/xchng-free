import { type ConnectionOptions, Queue, Worker } from "bullmq";
import {
  processUserNotification,
  processAdminNotification,
} from "./notificationHelpers";

const redisUrl = process.env.REDIS_URL;
const redisPassword = process.env.REDIS_PASSWORD;
const redisPort = process.env.REDIS_PORT;
if (!redisUrl) {
  throw Error("REDIS_URL env variable not passed");
}

if (!redisPassword) {
  throw Error("REDIS_PASSWORD env variable not passed");
}

const connection: ConnectionOptions = {
  host: redisUrl,
  port: parseInt(redisPort!, 10),
  password: redisPassword,
  url: redisUrl,
};

export const queue = new Queue("notifications", {
  connection,
});

const worker = new Worker(
  "notifications",
  async (job) => {
    const { userId, payload } = job.data;

    if (userId) {
      console.log("SINGLE USER NOTIFICATION ");
      if (typeof userId === "string") {
        await processUserNotification(userId, payload);
      } else {
        console.error("userId is not a string", userId);
        await Promise.all(
          userId.map((id: string) => processUserNotification(id, payload))
        );
      }
    } else {
      console.log("ADMIN notifications ");
      await processAdminNotification(payload);
    }
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed with error ${err}`);
});

// Add graceful shutdown function lol
async function gracefulShutdown() {
  console.log("Shutting down gracefully...");
  await worker.close();
  await queue.close();
  process.exit(0);
}

// Handle termination signals
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
