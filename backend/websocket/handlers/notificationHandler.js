const fs = require("fs").promises;
const path = require("path");

const NOTIFICATIONS_DIR = path.join(__dirname, "../../storage/notifications");

async function sendQueuedNotifications(userId, socket, notificationQueue) {
  try {
    // Check in-memory queue
    const queuedNotifications = notificationQueue.get(userId) || [];

    // Send queued notifications from memory
    if (queuedNotifications.length > 0) {
      for (const notification of queuedNotifications) {
        socket.emit("notification", notification);
      }
      notificationQueue.delete(userId);
    }

    // Check file-based storage for persistent notifications
    const userNotificationFile = path.join(NOTIFICATIONS_DIR, `${userId}.json`);
    try {
      const fileData = await fs.readFile(userNotificationFile, "utf-8");
      const persistentNotifications = JSON.parse(fileData);

      if (persistentNotifications && persistentNotifications.length > 0) {
        for (const notification of persistentNotifications) {
          socket.emit("notification", notification);
        }

        // Clear the file after sending
        await fs.writeFile(userNotificationFile, JSON.stringify([]));
      }
    } catch (fileError) {
      // File doesn't exist or is empty - this is fine
      if (fileError.code !== "ENOENT") {
        console.error("Error reading notification file:", fileError);
      }
    }

    console.log(`Sent queued notifications for user ${userId}`);
  } catch (error) {
    console.error("Error sending queued notifications:", error);
  }
}

async function queueNotification(
  userId,
  notification,
  notificationQueue,
  activeConnections
) {
  try {
    // Check if user is currently connected
    const socket = activeConnections.get(userId);

    if (socket && socket.connected) {
      // Send immediately if connected
      socket.emit("notification", notification);
      console.log(`Sent notification immediately to user ${userId}`);
    } else {
      // Queue in memory first
      if (!notificationQueue.has(userId)) {
        notificationQueue.set(userId, []);
      }
      notificationQueue.get(userId).push(notification);

      // Also persist to file for reliability
      await persistNotificationToFile(userId, notification);
      console.log(`Queued notification for user ${userId}`);
    }
  } catch (error) {
    console.error("Error queuing notification:", error);
    throw error;
  }
}

async function persistNotificationToFile(userId, notification) {
  try {
    // Ensure notifications directory exists
    try {
      await fs.access(NOTIFICATIONS_DIR);
    } catch {
      await fs.mkdir(NOTIFICATIONS_DIR, { recursive: true });
    }

    const userNotificationFile = path.join(NOTIFICATIONS_DIR, `${userId}.json`);

    let existingNotifications = [];
    try {
      const fileData = await fs.readFile(userNotificationFile, "utf-8");
      existingNotifications = JSON.parse(fileData) || [];
    } catch (error) {
      // File doesn't exist yet, start with empty array
      if (error.code !== "ENOENT") {
        console.error("Error reading existing notifications:", error);
      }
    }

    existingNotifications.push(notification);
    await fs.writeFile(
      userNotificationFile,
      JSON.stringify(existingNotifications, null, 2)
    );
  } catch (error) {
    console.error("Error persisting notification to file:", error);
    throw error;
  }
}

module.exports = {
  sendQueuedNotifications,
  queueNotification,
};
