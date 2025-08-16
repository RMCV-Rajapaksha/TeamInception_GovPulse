const notificationHandler = require("../../websocket/handlers/notificationHandler");

// Global access to websocket connections - will be set by server.js
let websocketConnections = null;
let websocketNotificationQueue = null;

function setWebSocketConnections(connections, queue) {
  websocketConnections = connections;
  websocketNotificationQueue = queue;
}

async function submitNotification(req, res) {
  try {
    const {
      user_id,
      notification_type,
      notification_content,
      issue_id,
      authority_id,
      appointment_id,
    } = req.body;

    // Validate required fields
    if (!user_id || !notification_type || !notification_content) {
      return res.status(400).json({
        message:
          "user_id, notification_type, and notification_content are required",
      });
    }

    // Create notification object
    const notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id,
      notification_type,
      notification_content,
      issue_id: issue_id || null,
      authority_id: authority_id || null,
      appointment_id: appointment_id || null,
      timestamp: new Date().toISOString(),
      read: false,
    };

    // Queue or send the notification
    await notificationHandler.queueNotification(
      user_id,
      notification,
      websocketNotificationQueue,
      websocketConnections
    );

    res.status(200).json({
      message: "Notification successfully submitted",
    });
  } catch (error) {
    console.error("Error in submitNotification:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = {
  submitNotification,
  setWebSocketConnections,
};
