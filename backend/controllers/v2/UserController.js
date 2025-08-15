const { PrismaClient } = require("../../generated/prisma");
const {clerkClient} = require("@clerk/express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

const saltRounds = 10;

const clerkSupportedSignup = async (req, res) => {
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

    const substituteHashedPassword = await bcrypt.hash(userFromClerk.id + "" + emailAddress + process.env.JWT_SECRET, saltRounds);
    // Create a new user in the database
    const newUser = await prisma.user.create({
      data: {
        first_name: userFromClerk.firstName || "",
        last_name: userFromClerk.lastName || "",
        email: emailAddress,
        password: substituteHashedPassword,
        clerk_user_id: userIdFromClerk,
        // Add other necessary fields here
      },
    });

    res.status(201).json({ message : "User registered successfully through backend" });

  } catch (error) {
    console.error("Error in clerk supported signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = {
  clerkSupportedSignup,
};
