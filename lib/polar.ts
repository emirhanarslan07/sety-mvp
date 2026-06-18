import { Polar } from "@polar-sh/sdk";

export const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN || "dummy_token",
  server: process.env.POLAR_ENV === "production" ? "production" : "sandbox",
});
