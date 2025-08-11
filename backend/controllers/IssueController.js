const { PrismaClient } = require("../generated/prisma");

const prisma = new PrismaClient();

const test = async (req, res) => {
  try {
    // Fetch all users from the database using the Prisma Client
    const allUsers = await prisma.user.findMany();

    // Send a 200 OK response with the fetched user data
    res.status(200).json(allUsers);
  } catch (error) {
    // Log the error for debugging
    console.error("Failed to fetch users:", error);

    // Send a 500 Internal Server Error response
    res
      .status(500)
      .json({ message: "An error occurred while fetching users." });
  } finally {
    // Ensure the database connection is closed after the query
    await prisma.$disconnect();
  }
};

const createIssue = async (req, res) => {
  try {
    const { user } = req; // Extract user info from the request object
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { title, description, status_id } = req.body;

    // Validate input data
    if (!title || !description || !status_id) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create a new issue in the database
    const newIssue = await prisma.issue.create({
      data: {
        User:{
          connect: { user_id: parseInt(user.user_id) } // Connect to the authenticated user
        },
        title,
        description,
        Issue_Status:{
          connect: { status_id: parseInt(status_id) } // Connect to the existing status
        }
      },
    });

    // Send a 201 Created response with the newly created issue
    res.status(201).json(newIssue);
  } catch (error) {
    // Log the error for debugging
    console.error("Failed to create issue:", error);

    // Send a 500 Internal Server Error response
    res.status(500).json({ message: "An error occurred while creating the issue." });
  }
};

module.exports = {
  test,
  createIssue,
};
