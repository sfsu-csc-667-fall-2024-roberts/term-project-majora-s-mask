import "express-session";

declare module "express-session" {
  interface SessionData {
    views?: number; // Add the custom property `views`
    userId?: number; // Keep `userId` if you're also using it
  }
}
