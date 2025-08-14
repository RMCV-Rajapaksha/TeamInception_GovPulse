const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

/**
 * Add an upvote for an issue
 */
const addUpvote = async (req, res) => {
  try {
    const { user } = req.user; // user object should have user_id
    const { issue_id, comment } = req.body;

    if (!user?.user_id || !issue_id) {
      return res.status(400).json({ error: "User ID and issue ID are required" });
    }

    // Check if already upvoted
    const existingUpvote = await prisma.upvote.findUnique({
      where: {
        user_id_issue_id: {
          user_id: user.user_id,
          issue_id: issue_id
        }
      }
    });

    if (existingUpvote) {
      return res.status(409).json({ error: "You have already upvoted this issue" });
    }

    // Create upvote
    const newUpvote = await prisma.upvote.create({
      data: {
        user_id: user.user_id,
        issue_id: issue_id,
        comment: comment || null
      }
    });

    return res.status(201).json({
      message: "Upvote added successfully",
      upvote: newUpvote
    });

  } catch (error) {
    console.error("Error adding upvote:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Remove an upvote for an issue
 */
const removeUpvote = async (req, res) => {
  try {
    const { user } = req.body;
    const { issue_id } = req.body;

    if (!user?.user_id || !issue_id) {
      return res.status(400).json({ error: "User ID and issue ID are required" });
    }

    await prisma.upvote.delete({
      where: {
        user_id_issue_id: {
          user_id: user.user_id,
          issue_id: issue_id
        }
      }
    });

    return res.status(200).json({ message: "Upvote removed successfully" });

  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Upvote not found" });
    }
    console.error("Error removing upvote:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get total upvotes for an issue
 */
const getUpvoteCount = async (req, res) => {
  try {
    const { issue_id } = req.params;

    if (!issue_id) {
      return res.status(400).json({ error: "Issue ID is required" });
    }

    const count = await prisma.upvote.count({
      where: { issue_id: parseInt(issue_id) }
    });

    return res.status(200).json({ issue_id, upvote_count: count });

  } catch (error) {
    console.error("Error fetching upvote count:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Check if a user has already upvoted
 */
const hasUserUpvoted = async (req, res) => {
  try {
    const { user } = req.body;
    const { issue_id } = req.params;

    if (!user?.user_id || !issue_id) {
      return res.status(400).json({ error: "User ID and issue ID are required" });
    }

    const upvote = await prisma.upvote.findUnique({
      where: {
        user_id_issue_id: {
          user_id: user.user_id,
          issue_id: parseInt(issue_id)
        }
      }
    });

    return res.status(200).json({ has_upvoted: !!upvote });

  } catch (error) {
    console.error("Error checking upvote status:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addUpvote,
  removeUpvote,
  getUpvoteCount,
  hasUserUpvoted
};
