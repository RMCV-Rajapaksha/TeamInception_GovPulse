const { PrismaClient } = require("../../generated/prisma");
const prisma = new PrismaClient();

const getAuthorities = async (req, res) => {
  try {
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
    res
      .status(500)
      .json({ message: "An error occurred while fetching authorities." });
  }
};

const getAvailableIssueStatusOfAuthority = async (req, res) => {
  try {
    // Get authority_id from the verified official token
    const { authority_id } = req.official;

    if (!authority_id) {
      return res
        .status(400)
        .json({ message: "Authority ID not found in token." });
    }

    // Fetch issue statuses for the specific authority
    const issueStatuses = await prisma.issue_Status.findMany({
      where: {
        authority_id: authority_id,
      },
    });

    if (!issueStatuses || issueStatuses.length === 0) {
      return res
        .status(404)
        .json({ message: "No issue statuses found for this authority." });
    }

    // Send a 200 OK response with the fetched issue status data
    res.status(200).json(issueStatuses);
  } catch (error) {
    // Log the error for debugging
    console.error("Failed to fetch issue statuses:", error);

    // Send a 500 Internal Server Error response
    res
      .status(500)
      .json({ message: "An error occurred while fetching issue statuses." });
  }
};

module.exports = {
  getAuthorities,
  getAvailableIssueStatusOfAuthority,
};
