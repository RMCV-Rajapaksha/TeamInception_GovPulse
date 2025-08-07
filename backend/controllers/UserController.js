const { PrismaClient } = require("../generated/prisma");
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

    res.status(201).json(user);
  } catch (error) {
    console.error("Error signing up user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const passwordHashed = await bcrypt.hash(password, saltRounds);
    const storedHashedPassword = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        password: true,
      },
    });

    if (!storedHashedPassword) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      storedHashedPassword.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    res.status(200).json({
      user: {
        user_id: user.user_id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal server error" + error.message });
  }
};

module.exports = {
  signup,
  login,
};
