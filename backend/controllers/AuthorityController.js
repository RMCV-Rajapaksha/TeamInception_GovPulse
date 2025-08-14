const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const {getAuth, createClerkClient} = require("@clerk/express");

const getAuthorities = async (req, res) => {
  try {
    const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })
    console.log("Clerk Client:", clerkClient);
    const { userId } = getAuth(req);
    const userFromClerk = await clerkClient.users.getUser(userId);
    const emailAddressId = userFromClerk.primaryEmailAddressId;
    const emailAddress = await (await clerkClient.emailAddresses.getEmailAddress(emailAddressId)).emailAddress;
    console.log("User from Clerk:", userFromClerk);
    console.log("Email Address:", emailAddress);
    // Fetch all authorities from the database using the Prisma Client
    const authorities = await prisma.authorities.findMany();

    if (!authorities || authorities.length === 0) {
      return res.status(404).json({ message: "No authorities found." });
    }
    // Send a 200 OK response with the fetched authority data
    res.status(200).json(authorities);
  } catch (error) {
    // Log the error for debugging
    console.error("Failed to fetch authorities:", error);

    // Send a 500 Internal Server Error response
    res.status(500).json({ message: "An error occurred while fetching authorities." });
  }
};

module.exports = {
  getAuthorities,
};