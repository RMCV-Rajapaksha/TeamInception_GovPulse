// Test script for email notification system
// Run this to test email functionality without making actual appointments

const dotenv = require("dotenv");
dotenv.config();

const {
  sendAppointmentConfirmationEmail,
  sendAppointmentReminderEmail,
  sendStatusUpdateEmail,
} = require("./utils/EmailFunctions");

async function testEmailSystem() {
  console.log("🧪 Testing Email Notification System...\n");

  // Test data
  const testData = {
    userEmail: "code.chamara@gmail.com", // Replace with your test email
    userName: "John Doe",
    authorityName: "Department of Education",
    date: new Date("2025-08-16"),
    timeSlot: "10:00 AM - 11:00 AM",
    issueTitle: "School Transfer Request",
    appointmentId: 999,
    authorityCategory: "Education",
  };

  try {
    // Test 1: Confirmation Email
    console.log("📧 Testing confirmation email...");
    const confirmationResult = await sendAppointmentConfirmationEmail(testData);
    console.log(
      `Confirmation email: ${confirmationResult ? "✅ Success" : "❌ Failed"}\n`
    );

    // Test 2: Reminder Email
    console.log("⏰ Testing reminder email...");
    const reminderResult = await sendAppointmentReminderEmail(testData);
    console.log(
      `Reminder email: ${reminderResult ? "✅ Success" : "❌ Failed"}\n`
    );

    // Test 3: Status Update Email
    console.log("📝 Testing status update email...");
    const updateData = {
      ...testData,
      officialName: "Mr. Smith",
      updateType: "request",
      message:
        "Please bring your original birth certificate and school leaving certificate for verification.",
    };
    const updateResult = await sendStatusUpdateEmail(updateData);
    console.log(
      `Status update email: ${updateResult ? "✅ Success" : "❌ Failed"}\n`
    );

    console.log("🎉 Email system testing completed!");
    console.log(
      "\n📝 Note: Change the test email address in this script to receive actual test emails."
    );
  } catch (error) {
    console.error("❌ Error during testing:", error);
  }
}

// Run the email system test
testEmailSystem();

console.log("💡 To test the email system:");
console.log("1. Set up your EMAIL_USER and EMAIL_PASS in .env file");
console.log(
  "2. Replace test@example.com with your actual email in this script"
);
console.log("3. Uncomment the testEmailSystem() call at the bottom");
console.log("4. Run: node test-email-system.js");
