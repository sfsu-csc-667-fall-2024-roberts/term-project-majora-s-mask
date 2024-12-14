import { Request, Response, NextFunction } from "express";

// Middleware to protect routes
export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.session && (req.session as any).userId) {
    return next(); // User is authenticated
  }
  res.redirect("/auth/login"); // Redirect to login if not authenticated
}
