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

module.exports = {
  test,
};
