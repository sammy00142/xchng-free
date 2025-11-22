import { env } from "@/env";

export const sendSMSNotification = async (to: string, message: string) => {
  const data = {
    to,
    from: "greatex",
    sms: "Hello, this is a test message GREAT EXCHANGE",
    type: "plain",
    api_key: env.TERMII_API_KEY,
    channel: "generic",
  };

  try {
    const res = await fetch(`${env.TERMII_BASE_URL}/api/sms/send`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("json: ", JSON.stringify(data));

    const result = await res.json();

    console.log("[TERMII_SUCCESS]:[SEND_SMS_NOTIFICATION]", result);
  } catch (error) {
    console.error("[TERMII_ERROR]:[SEND_SMS_NOTIFICATION]", error);
  }
};
