import { env } from "@/env";
import twilio from "twilio";
// Download the helper library from https://www.twilio.com/docs/node/install

// Find your Account SID and Auth Token at twilio.com/console

// and set the environment variables. See http://twil.io/secure

const accountSid = env.TWILIO_ACCOUNT_SID;

const authToken = env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

export const sendNewChatNotification = async (to: string, text: string) => {
  try {
    // const msg = await client.messages.create({
    //   body: text,
    //   from: env.TWILIO_PHONE_NUMBER,
    //   to: to,
    //   forceDelivery: true,
    // });
    const messageBody = {
      api_key: "Your API Key",
      to: to ?? "09071957815",
      from: "Greatxchng",
      sms: text ?? "You have a new chat request from the website",
      type: "plain",
      channel: "generic",
    };

    

    // console.log("[SMS_SUCCESS]:[SEND_NEW_CHAT_NOTIFICATION]", msg);
  } catch (error) {
    console.error("[SMS_ERROR]:[SEND_NEW_CHAT_NOTIFICATION]", error);
  }
};
