import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";

import "dotenv/config";

//initialize arcjet
export const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    //protect against sql injection, etc.
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      //block bots except search engines
      allow: ["CATEGORY:SearchEngine"],
    }),
    //rate limiting
    tokenBucket({
      mode: "LIVE",
      refillRaterate: 5,
      interval: 10,
      capacity: 10,
    }),
  ],
});
