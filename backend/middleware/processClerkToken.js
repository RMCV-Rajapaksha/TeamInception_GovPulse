const { PrismaClient } = require("../generated/prisma");
const {getAuth, clerkClient} = require("@clerk/express");
const prisma = new PrismaClient();

const addUserIdFromClerk = (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    req.userIdFromClerk = userId; // Attach userIdFromClerk to the request object
    next();
  } catch (error) {
    console.error("Error in addUserIdFromClerk middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const addRelatedUserFromDatabase = async (req, res, next) => {
  try {
    const userIdFromClerk = req.userIdFromClerk;
    if (!userIdFromClerk) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Assuming you have a function to fetch user details from your database
    const user = await prisma.users.findUnique({
      where: { clerk_user_id: userIdFromClerk },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // Attach the user object to the request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error in addRelatedUserFromDatabase middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const registerUserInDatabase = async (req, res, next) => {
  try {
    const userIdFromClerk = req.userIdFromClerk;
    if (!userIdFromClerk) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const userFromClerk = await clerkClient.users.getUser(userIdFromClerk);
    const emailAddressId = userFromClerk.primaryEmailAddressId;
    const emailAddress = await (await clerkClient.emailAddresses.getEmailAddress(emailAddressId)).emailAddress;
    
    const userExists = await prisma.user.findUnique({
      where: { clerk_user_id: userIdFromClerk },
    });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    // Create a new user in the database
    const newUser = await prisma.user.create({
      data: {
        first_name: userFromClerk.firstName || "",
        last_name: userFromClerk.lastName || "",
        email: emailAddress,
        clerk_user_id: userIdFromClerk,
        // Add other necessary fields here
      },
    });

    req.user = newUser; // Attach the newly created user to the request
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error in registerUserInDatabase middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  addUserIdFromClerk,
  addRelatedUserFromDatabase,
  registerUserInDatabase,
};