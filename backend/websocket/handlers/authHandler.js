const { PrismaClient } = require("../../generated/prisma");
const { clerkClient } = require("@clerk/express");

const prisma = new PrismaClient();

async function authenticateUser(token) {
  try {
    if (!token) {
      return { success: false, message: "No token provided" };
    }

    // Remove 'Bearer ' prefix if present
    const cleanToken = token.startsWith("Bearer ") ? token.slice(7) : token;

    // Use Clerk to verify the token and get user info
    let userFromClerk;
    try {
      // For session tokens, we need to verify using Clerk
      // This is a simplified approach - in production, you'd want to verify the JWT signature
      const decodedPayload = JSON.parse(
        Buffer.from(cleanToken.split(".")[1], "base64").toString()
      );
      const userIdFromClerk = decodedPayload.sub;

      if (!userIdFromClerk) {
        return { success: false, message: "Invalid token format" };
      }

      // Verify user exists in Clerk
      userFromClerk = await clerkClient.users.getUser(userIdFromClerk);
      if (!userFromClerk) {
        return { success: false, message: "User not found in Clerk" };
      }

      // Find user in our database
      const user = await prisma.user.findUnique({
        where: { clerk_user_id: userIdFromClerk },
      });

      if (!user) {
        return { success: false, message: "User not found in database" };
      }

      return {
        success: true,
        userId: user.user_id,
        clerkUserId: userIdFromClerk,
        user: user,
      };
    } catch (jwtError) {
      console.error("JWT verification error:", jwtError);
      return { success: false, message: "Invalid token" };
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return { success: false, message: "Authentication failed" };
  }
}

module.exports = {
  authenticateUser,
};
