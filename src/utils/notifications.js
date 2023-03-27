const { Expo } = require("expo-server-sdk");

let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });

const sendNotification = (list) => {
  let somePushTokens;
  if (typeof list === "string") {
    somePushTokens = [list];
  } else {
    somePushTokens = list;
  }

  let messages = [];
  for (let pushToken of somePushTokens) {
    if (!Expo.isExpoPushToken(pushToken)) {
      continue;
    }
    // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
    messages.push({
      to: pushToken,
      sound: "default",
      body: "This is a test notification",
      data: { withSome: "data" },
    });
  }

  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  (async () => {
    for (let chunk of chunks) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error(error);
      }
    }
  })();
};

module.exports = {
  sendNotification,
};
