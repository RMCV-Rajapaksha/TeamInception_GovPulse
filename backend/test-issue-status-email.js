/**
 * Test script for Issue Status Update Email System
 * 
 * This script tests the email functionality that gets triggered when
 * an authority updates the status of an issue.
 * 
 * Usage: node test-issue-status-email.js
 */

require('dotenv').config();
const { sendIssueStatusUpdateEmail } = require('./utils/EmailFunctions');

const testIssueStatusUpdateEmail = async () => {
  console.log("🧪 Testing Issue Status Update Email System...");
  console.log("=" * 60);

  // Test data - Replace with actual test data
  const testEmailData = {
    userEmail: "code.chamara@gmail.com", // Replace with your test email
    userName: "John Doe",
    userFirstName: "John",
    userLastName: "Doe",
    issueId: 1,
    issueTitle: "Street Lighting Problem in Main Road",
    issueDescription: "The street lights on Main Road have been malfunctioning for the past week. This is causing safety concerns for pedestrians and drivers, especially during night time. The issue affects approximately 200 meters of road between the shopping complex and residential area.",
    previousStatus: "Pending Review",
    newStatus: "Assigned to Team",
    authorityName: "Municipal Corporation - Infrastructure Department",
    categoryName: "Infrastructure",
    urgencyScore: 7.5,
    updatedAt: new Date(),
    issueCreatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
  };

  console.log("📋 Test Email Data:");
  console.log(`  User: ${testEmailData.userFirstName} ${testEmailData.userLastName} (${testEmailData.userEmail})`);
  console.log(`  Issue: #${testEmailData.issueId} - ${testEmailData.issueTitle}`);
  console.log(`  Status Change: "${testEmailData.previousStatus}" → "${testEmailData.newStatus}"`);
  console.log(`  Authority: ${testEmailData.authorityName}`);
  console.log(`  Urgency: ${testEmailData.urgencyScore}/10`);
  console.log("");

  try {
    console.log("📤 Sending test email...");
    const result = await sendIssueStatusUpdateEmail(testEmailData);
    
    if (result) {
      console.log("✅ Email sent successfully!");
      console.log("");
      console.log("📧 Email Details:");
      console.log(`  To: ${testEmailData.userEmail}`);
      console.log(`  Subject: Issue Status Updated: ${testEmailData.issueTitle} - #${testEmailData.issueId}`);
      console.log(`  Status: ${testEmailData.newStatus}`);
      console.log("");
      console.log("🔍 Please check your email inbox to verify the content and formatting.");
      console.log("📱 Also check spam/junk folder if you don't see it in your inbox.");
    } else {
      console.log("❌ Failed to send email!");
      console.log("Check your email configuration in the .env file:");
      console.log("  - EMAIL_USER");
      console.log("  - EMAIL_PASS");
    }
  } catch (error) {
    console.error("💥 Error testing email system:", error.message);
    console.log("");
    console.log("🔧 Troubleshooting tips:");
    console.log("1. Verify your email credentials in .env file");
    console.log("2. Check if you have enabled 'App Passwords' for Gmail");
    console.log("3. Ensure your internet connection is stable");
    console.log("4. Check if the email service is accessible");
  }

  console.log("");
  console.log("🏁 Test completed!");
};

// Test different status scenarios
const testMultipleStatusScenarios = async () => {
  console.log("🔄 Testing Multiple Status Update Scenarios...");
  console.log("=" * 60);

  const baseEmailData = {
    userEmail: "test.user@example.com", // Replace with your test email
    userName: "Jane Smith",
    userFirstName: "Jane",
    userLastName: "Smith",
    issueId: 2,
    issueTitle: "Garbage Collection Not Following Schedule",
    issueDescription: "Garbage collection in our area has been irregular. The scheduled collection day is Monday, but collectors often come on Wednesday or Thursday, causing waste to pile up and create hygiene issues.",
    authorityName: "Municipal Corporation - Waste Management",
    categoryName: "Sanitation",
    urgencyScore: 6.2,
    updatedAt: new Date(),
    issueCreatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  };

  const statusScenarios = [
    {
      name: "Progress Update",
      previousStatus: "Pending Review",
      newStatus: "In Progress",
    },
    {
      name: "Completion",
      previousStatus: "In Progress", 
      newStatus: "Completed",
    },
    {
      name: "Assignment",
      previousStatus: "Pending Review",
      newStatus: "Assigned to Team",
    },
    {
      name: "Rejection",
      previousStatus: "Under Review",
      newStatus: "Request Rejected",
    }
  ];

  for (let i = 0; i < statusScenarios.length; i++) {
    const scenario = statusScenarios[i];
    console.log(`\n📊 Testing Scenario ${i + 1}: ${scenario.name}`);
    console.log(`   Status: "${scenario.previousStatus}" → "${scenario.newStatus}"`);

    const emailData = {
      ...baseEmailData,
      issueId: baseEmailData.issueId + i,
      previousStatus: scenario.previousStatus,
      newStatus: scenario.newStatus,
    };

    try {
      const result = await sendIssueStatusUpdateEmail(emailData);
      console.log(`   ${result ? '✅' : '❌'} Email ${result ? 'sent' : 'failed'}`);
      
      // Add delay between emails to avoid rate limiting
      if (i < statusScenarios.length - 1) {
        console.log("   ⏳ Waiting 2 seconds...");
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }

  console.log("\n🏁 Multiple scenarios test completed!");
};

// Main execution
const runTests = async () => {
  console.log("🚀 Issue Status Update Email System - Test Suite");
  console.log("=" * 60);
  console.log("");

  // Check environment variables
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("⚠️  Warning: Email credentials not found in environment variables");
    console.log("Please set EMAIL_USER and EMAIL_PASS in your .env file");
    console.log("Example:");
    console.log("  EMAIL_USER=your-email@gmail.com");
    console.log("  EMAIL_PASS=your-app-password");
    console.log("");
  }

  try {
    // Test 1: Basic functionality
    await testIssueStatusUpdateEmail();
    
    console.log("\n" + "=" * 60);
    
    // Test 2: Multiple scenarios (uncomment to test)
    // await testMultipleStatusScenarios();
    
  } catch (error) {
    console.error("💥 Test suite failed:", error.message);
  }
};

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = {
  testIssueStatusUpdateEmail,
  testMultipleStatusScenarios,
  runTests
};
