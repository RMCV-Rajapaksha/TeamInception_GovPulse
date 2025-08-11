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

const deleteIssue = async (req, res) => {
  try {
    const { issue_id } = req.params;
    
    // Validate input data
    if (!issue_id) {
      return res.status(400).json({ error: "Issue ID is required" });
    }

    // Delete the issue from the database
    await prisma.issue.delete({
      where: { issue_id: parseInt(issue_id) },
    });

    res.status(200).json({ message: "Issue deleted successfully." });
  } catch (error) {
    // Log the error for debugging
    console.error("Failed to delete issue:", error);
    if(error.code === 'P2025') {
      // If the issue was not found, send a 404 Not Found response
      return res.status(404).json({ error: "Issue not found." });
    }
    // Send a 500 Internal Server Error response
    res.status(500).json({ message: "An error occurred while deleting the issue." });
  }
};

const getUserIssues = async (req, res) => {
  try {
    const { user } = req; // Extract user info from the request object
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Fetch issues created by the authenticated user
    const issues = await prisma.issue.findMany({
      where: { user_id: parseInt(user.user_id) },
      include: {
        User: true,
        Issue_Status: true, // Include related status information
      },
    });

    // Send a 200 OK response with the fetched issues
    res.status(200).json(issues);
  } catch (error) {
    // Log the error for debugging
    console.error("Failed to fetch user issues:", error);

    // Send a 500 Internal Server Error response
    res.status(500).json({ message: "An error occurred while fetching user issues." });
  }
}

const getIssues = async (req, res) => { 
  try {
    // Fetch all issues from the database
    const issues = await prisma.issue.findMany({
      include: {
        User: true, // Include user information
        Issue_Status: true, // Include status information
      },
    });

    // Send a 200 OK response with the fetched issues
    res.status(200).json(issues);
  } catch (error) {
    // Log the error for debugging
    console.error("Failed to fetch issues:", error);

    // Send a 500 Internal Server Error response
    res.status(500).json({ message: "An error occurred while fetching issues." });
  }
}

const getIssueById = async (req, res) => {
  try {
    const { issue_id } = req.params;

    // Validate input data
    if (!issue_id) {
      return res.status(400).json({ error: "Issue ID is required" });
    }

    // Fetch the issue by ID from the database
    const issue = await prisma.issue.findUnique({
      where: { issue_id: parseInt(issue_id) },
      include: {
        User: true, // Include user information
        Issue_Status: true, // Include status information
      },
    });

    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    // Send a 200 OK response with the fetched issue
    res.status(200).json(issue);
  } catch (error) {
    // Log the error for debugging
    console.error("Failed to fetch issue:", error);

    // Send a 500 Internal Server Error response
    res.status(500).json({ message: "An error occurred while fetching the issue." });
  }
}

module.exports = {
  test,
  createIssue,
  deleteIssue,
  getUserIssues,
  getIssueById,
  getIssues
};
