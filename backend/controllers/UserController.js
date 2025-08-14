const { PrismaClient } = require("../generated/prisma");
const {clerkClient} = require("@clerk/express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

const saltRounds = 10;

const signup = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      name,
      email,
      password,
      nic,
      role,
      profile_image_url,
    } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const isExistingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (isExistingUser) {
      return res.status(409).json({ error: "User already exists" });
    }

    // Create the user in the database
    const user = await prisma.user.create({
      data: {
        first_name,
        last_name,
        name,
        email,
        password: hashedPassword,
        nic,
        role,
        profile_image_url,
      },
    });
    // Generate a JWT token for the user
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // Token expires in 1 day
    );

    res.status(201).json({ message : "User registered successfully", user_id: user.user_id, token });
  } catch (error) {
    console.error("Error signing up user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
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

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find the user by email to retrieve their stored password hash
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    // If no user is found, return an error
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the plain-text password from the request with the stored hashed password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password // Use the password hash from the retrieved user object
    );

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

        // Generate a JWT token for the user
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // Token expires in 1 day
    );

    // Login successful, send back user details (without the password)
    res.status(200).json({
      message: "Login successful",
      user_id: user.user_id,
      token: token
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal server error" + error.message });
  }
};

const removeAccount = async (req, res) => {
  // Extract the user_id from the request headers.
  // It's important to convert it to a number as req.headers values are strings.
  const user_id = parseInt(req.headers.user_id, 10);

  // Check if user_id is a valid number
  if (isNaN(user_id)) {
    return res.status(400).json({ error: "Invalid user ID provided." });
  }

  try {
    // We only need to delete the user record.
    // The foreign key constraints with ON DELETE CASCADE in the database
    // will automatically handle the deletion of all linked records
    // in the ISSUE, UPVOTE, and APPOINTMENT tables.
    const deletedUser = await prisma.user.delete({
      where: {
        user_id: user_id,
      },
    });

    console.log(
      `User with ID ${user_id} and all related data have been successfully deleted.`
    );
    return res.status(200).json({
      message: `User with ID ${user_id} was successfully deleted.`,
    });
  } catch (error) {
    // Prisma error code for "record not found" (P2025)
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ error: `User with ID ${user_id} not found.` });
    }
    console.error("An error occurred during account deletion:", error);
    return res.status(500).json({
      error: "Failed to delete user account due to a database error.",
    });
  }
};

module.exports = {
  signup,
  login,
  removeAccount,
  clerkSupportedSignup,
};
