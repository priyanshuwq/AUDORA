import { clerkClient } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
  try {
    if (!req.auth || !req.auth.userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized - missing or invalid token" });
    }
    next();
  } catch (e) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    const currentUser = await clerkClient.users.getUser(req.auth.userId);
    const userEmail = currentUser.primaryEmailAddress?.emailAddress;
    const adminEmails = (
      process.env.ADMIN_EMAILS ||
      process.env.ADMIN_EMAIL ||
      ""
    )
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    const isAdmin = adminEmails.includes((userEmail || "").toLowerCase());

    if (!isAdmin) {
      return res.status(403).json({
        message: "Unauthorized - you must be an admin",
      });
    }

    next();
  } catch (error) {
    console.log("Error in requireAdmin:", error);
    next(error);
  }
};
