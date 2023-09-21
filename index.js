import functions from "@google-cloud/functions-framework";
import GoogleChatCard, { GoogleChatImageType } from "google-chat-cards";

// Register a CloudEvent callback with the Functions Framework that will
// be executed when the Pub/Sub trigger topic receives a message.
functions.cloudEvent("helloPubSub", async (cloudEvent) => {
  const GOOGLE_CHAT_WEBHOOK_URL = process.env["GOOGLE_CHAT_WEBHOOK_URL"];
  console.log(GOOGLE_CHAT_WEBHOOK_URL);

  const base64Data = cloudEvent.data.message.data;

  const jsonStringData = Buffer.from(base64Data, "base64").toString("utf-8");

  const data = JSON.parse(jsonStringData);

  const incident = data.incident;

  sendIncidentToGoogleChat(incident, GOOGLE_CHAT_WEBHOOK_URL);
});

export function sendIncidentToGoogleChat(incident, url) {
  let card = new GoogleChatCard()
    .header("Google Cloud Monitoring Alert")
    .section(incident.policy_name)
    .decoratedText(incident.summary)
    .section()
    .button("GO TO INCIDENT", incident.url);

  card.send(process.env.GOOGLE_CHAT_WEBHOOK_URL);
}
