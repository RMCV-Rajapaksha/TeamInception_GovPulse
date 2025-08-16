const { Server } = require("socket.io");
const authHandler = require("./handlers/authHandler");
const notificationHandler = require("./handlers/notificationHandler");

// Active connections storage
const activeConnections = new Map(); // Map<user_id, socket>
const notificationQueue = new Map(); // Map<user_id, Array<notification>>

function initializeWebSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New socket connection:", socket.id);

    // Handle authentication
    socket.on("authenticate", async (data) => {
      try {
        const result = await authHandler.authenticateUser(data.token);
        if (result.success) {
          const userId = result.userId;

          // Store the connection
          activeConnections.set(userId, socket);
          socket.userId = userId;

          // Send authentication success
          socket.emit("authenticated", {
            success: true,
            userId: userId,
          });

          // Send any queued notifications
          await notificationHandler.sendQueuedNotifications(
            userId,
            socket,
            notificationQueue
          );

          console.log(`User ${userId} authenticated and connected`);
        } else {
          socket.emit("authentication_error", {
            success: false,
            message: result.message,
          });
        }
      } catch (error) {
        console.error("Authentication error:", error);
        socket.emit("authentication_error", {
          success: false,
          message: "Authentication failed",
        });
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      if (socket.userId) {
        activeConnections.delete(socket.userId);
        console.log(`User ${socket.userId} disconnected`);
      }
    });
  });

  return {
    io,
    activeConnections,
    notificationQueue,
  };
}

module.exports = {
  initializeWebSocket,
  activeConnections,
  notificationQueue,
};
