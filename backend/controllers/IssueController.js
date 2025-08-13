const { parse } = require("dotenv");
const { PrismaClient } = require("../generated/prisma");
const { getUrgencyScore } = require("../utils/GeminiFunctions");

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

    const { title, description, grama, city, district, sector, image_urls } =
      req.body;

    // Validate input data
    if (!title || !description || !district || !sector) {
      return res.status(400).json({
        error: "title, description, district, and sector are required",
      });
    }

    // Map sector to category_id (you'll need to adjust these mappings based on your database)
    const sectorToCategoryMap = {
      "Roads & Transport": 1,
      "Water Supply": 2,
      Electricity: 3,
      "Waste Management": 4,
      Other: 5,
    };

    // Map sector to authority_id (you'll need to adjust these mappings based on your database)
    const sectorToAuthorityMap = {
      "Roads & Transport": 1,
      "Water Supply": 2,
      Electricity: 3,
      "Waste Management": 4,
      Other: 1,
    };

    const category_id = sectorToCategoryMap[sector];
    const authority_id = sectorToAuthorityMap[sector];

    if (!category_id || !authority_id) {
      return res.status(400).json({ error: "Invalid sector selected" });
    }

    // Generate urgency score
    const urgency_score_generated = await getUrgencyScore(
      title,
      description,
      grama,
      city,
      1, // default status_id
      authority_id,
      category_id,
      image_urls || ""
    );

    // Create a new issue in the database
    const newIssue = await prisma.issue.create({
      data: {
        User: {
          connect: { user_id: parseInt(user.user_id) }, // Connect to the authenticated user
        },
        title,
        description,
        district,
        gs_division: grama,
        ds_division: city,
        urgency_score: parseFloat(urgency_score_generated) || 0,
        Issue_Status: {
          connect: { status_id: 1 }, // Default to pending status
        },
        Authority: {
          connect: { authority_id: parseInt(authority_id) },
        },
        Category: {
          connect: { category_id: parseInt(category_id) },
        },
        image_urls: image_urls || "",
      },
      include: {
        User: true,
        Issue_Status: true,
        Authority: true,
        Category: true,
      },
    });

    // Send a 201 Created response with the newly created issue
    res.status(201).json(newIssue);
  } catch (error) {
    // Log the error for debugging
    console.error("Failed to create issue:", error);

    // Send a 500 Internal Server Error response
    res
      .status(500)
      .json({ message: "An error occurred while creating the issue." });
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
    if (error.code === "P2025") {
      // If the issue was not found, send a 404 Not Found response
      return res.status(404).json({ error: "Issue not found." });
    }
    // Send a 500 Internal Server Error response
    res
      .status(500)
      .json({ message: "An error occurred while deleting the issue." });
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
    res
      .status(500)
      .json({ message: "An error occurred while fetching user issues." });
  }
};

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
    res
      .status(500)
      .json({ message: "An error occurred while fetching issues." });
  }
};

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
    res
      .status(500)
      .json({ message: "An error occurred while fetching the issue." });
  }
};

module.exports = {
  test,
  createIssue,
  deleteIssue,
  getUserIssues,
  getIssueById,
  getIssues,
};
