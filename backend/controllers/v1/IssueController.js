const { parse } = require("dotenv");
const { PrismaClient } = require("../../generated/prisma");
const { getUrgencyScore } = require("../../utils/GeminiFunctions");
const { sendIssueStatusUpdateEmail } = require("../../utils/EmailFunctions");

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

    const {
      title,
      description,
      gs_division,
      ds_division,
      urgency_score,
      status_id,
      authority_id,
      category_id,
      image_urls,
    } = req.body;

    // Validate input data
    if (!title || !description || !authority_id || !category_id) {
      return res.status(400).json({
        error: "title, description, authority_id and category_id are required",
      });
    }
    urgency_score_generated = await getUrgencyScore(
      title,
      description,
      gs_division,
      ds_division,
      status_id,
      authority_id,
      category_id,
      image_urls
    );

    // Create a new issue in the database
    const newIssue = await prisma.issue.create({
      data: {
        User: {
          connect: { user_id: parseInt(user.user_id) }, // Connect to the authenticated user
        },
        title,
        description,
        gs_division,
        ds_division,
        urgency_score: parseFloat(urgency_score_generated) || 0, // Default to 0 if not provided
        Issue_Status: {
          connect: { status_id: parseInt(status_id) || 1 }, // Connect to the existing status
        },
        Authority: {
          connect: { authority_id: parseInt(authority_id) || null }, // Allow null if not provided
        },
        Category: {
          connect: { category_id: parseInt(category_id) }, // Allow null if not provided
        },
        image_urls: image_urls || "", // Default to empty string if not provided
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

const updateIssueStatus = async (req, res) => {
  try {
    const { official } = req; // Extract official info from the request object
    if (!official) {
      return res
        .status(401)
        .json({ error: "Unauthorized - Official access required" });
    }

    const { issue_id } = req.params;
    const { status_id } = req.body;

    // Validate input data
    if (!issue_id) {
      return res.status(400).json({ error: "Issue ID is required" });
    }

    if (!status_id) {
      return res.status(400).json({ error: "Status ID is required" });
    }

    // Check if the issue exists first and get current status
    const existingIssue = await prisma.issue.findUnique({
      where: { issue_id: parseInt(issue_id) },
      include: {
        Authority: true,
        User: true,
        Issue_Status: true,
        Category: true,
      },
    });

    if (!existingIssue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    // Verify that the official has authority to update this issue
    if (existingIssue.authority_id !== parseInt(official.authority_id)) {
      return res.status(403).json({
        error:
          "Forbidden - You can only update issues assigned to your authority",
      });
    }

    // Get the new status information
    const newStatusInfo = await prisma.issue_Status.findUnique({
      where: { status_id: parseInt(status_id) },
    });

    if (!newStatusInfo) {
      return res.status(404).json({ error: "Invalid status ID" });
    }

    // Store previous status for email
    const previousStatus = existingIssue.Issue_Status?.status_name || "Unknown";

    // Update the issue status
    const updatedIssue = await prisma.issue.update({
      where: { issue_id: parseInt(issue_id) },
      data: {
        status_id: parseInt(status_id),
      },
      include: {
        User: true,
        Issue_Status: true,
        Authority: true,
        Category: true,
      },
    });

    // Send email notification to the user
    try {
      const emailData = {
        userEmail: updatedIssue.User.email,
        userName: updatedIssue.User.name,
        userFirstName: updatedIssue.User.first_name,
        userLastName: updatedIssue.User.last_name,
        issueId: updatedIssue.issue_id,
        issueTitle: updatedIssue.title,
        issueDescription: updatedIssue.description,
        previousStatus: previousStatus,
        newStatus: updatedIssue.Issue_Status.status_name,
        authorityName: updatedIssue.Authority.name,
        categoryName: updatedIssue.Category.category_name,
        urgencyScore: updatedIssue.urgency_score || 0,
        updatedAt: new Date(),
        issueCreatedAt: updatedIssue.created_at,
      };

      await sendIssueStatusUpdateEmail(emailData);
      console.log(`Status update email sent for issue #${issue_id}`);
    } catch (emailError) {
      console.error("Failed to send status update email:", emailError);
      // Don't fail the entire request if email fails
    }

    // Send a 200 OK response with the updated issue
    res.status(200).json({
      message: "Issue status updated successfully",
      issue: updatedIssue,
      email_sent: true, // Indicate that email was attempted
    });
  } catch (error) {
    // Log the error for debugging
    console.error("Failed to update issue status:", error);

    // Handle specific Prisma errors
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Issue or status not found" });
    }

    // Send a 500 Internal Server Error response
    res
      .status(500)
      .json({ message: "An error occurred while updating the issue status." });
  }
};

const getAuthorityIssues = async (req, res) => {
  try {
    const { official } = req; // Extract official info from the request object
    if (!official) {
      return res
        .status(401)
        .json({ error: "Unauthorized - Official access required" });
    }

    // Fetch all issues assigned to the official's authority
    const issues = await prisma.issue.findMany({
      where: {
        authority_id: parseInt(official.authority_id),
      },
      include: {
        User: true, // Include user information
        Issue_Status: true, // Include status information
        Authority: true, // Include authority information
        Category: true, // Include category information
      },
      orderBy: [
        { urgency_score: "desc" }, // Order by urgency score (highest first)
        { created_at: "desc" }, // Then by creation date (newest first)
      ],
    });

    // Send a 200 OK response with the fetched issues
    res.status(200).json({
      message: `Found ${issues.length} issues for authority ID ${official.authority_id}`,
      authority_id: official.authority_id,
      total_issues: issues.length,
      issues: issues,
    });
  } catch (error) {
    // Log the error for debugging
    console.error("Failed to fetch authority issues:", error);

    // Send a 500 Internal Server Error response
    res
      .status(500)
      .json({ message: "An error occurred while fetching authority issues." });
  }
};

const getAvailableIssueStatuses = async (req, res) => {
  try {
    // Fetch all available issue statuses
    const statuses = await prisma.issue_Status.findMany({
      orderBy: {
        status_id: 'asc',
      },
    });

    // Send a 200 OK response with the available statuses
    res.status(200).json(statuses);
  } catch (error) {
    // Log the error for debugging
    console.error("Failed to fetch available issue statuses:", error);

    // Send a 500 Internal Server Error response
    res
      .status(500)
      .json({ message: "An error occurred while fetching available issue statuses." });
  }
};

module.exports = {
  test,
  createIssue,
  deleteIssue,
  getUserIssues,
  getIssueById,
  getIssues,
  updateIssueStatus,
  getAuthorityIssues,
  getAvailableIssueStatuses,
};
