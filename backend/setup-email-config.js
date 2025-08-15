/**
 * Email Configuration Setup Helper
 *
 * This script helps set up and validate email configuration for the
 * GovPulse issue status notification system.
 */

require("dotenv").config();
const readline = require("readline");
const fs = require("fs");
const path = require("path");
const { sendIssueStatusUpdateEmail } = require("./utils/EmailFunctions");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt) => {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const checkCurrentConfig = () => {
  console.log("🔍 Checking current email configuration...");
  console.log("");

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.log("❌ Email configuration not found in environment variables");
    console.log(
      "   Missing: " +
        (!emailUser ? "EMAIL_USER " : "") +
        (!emailPass ? "EMAIL_PASS" : "")
    );
    return false;
  }

  console.log("✅ Email configuration found:");
  console.log(`   EMAIL_USER: ${emailUser}`);
  console.log(`   EMAIL_PASS: ${"*".repeat(emailPass.length)} (hidden)`);
  console.log("");

  return true;
};

const setupEmailConfig = async () => {
  console.log("⚙️  Setting up email configuration...");
  console.log("");

  const emailUser = await question(
    "Enter your email address (e.g., your-email@gmail.com): "
  );

  if (!validateEmail(emailUser)) {
    console.log("❌ Invalid email format. Please try again.");
    return false;
  }

  console.log("");
  console.log("📝 For Gmail users:");
  console.log("   1. Enable 2-Factor Authentication");
  console.log("   2. Go to Google Account Settings > Security > App Passwords");
  console.log("   3. Generate a new App Password for 'Mail'");
  console.log(
    "   4. Use the 16-character App Password (not your regular password)"
  );
  console.log("");

  const emailPass = await question(
    "Enter your email password or App Password: "
  );

  if (!emailPass || emailPass.length < 8) {
    console.log("❌ Password too short. Please enter a valid password.");
    return false;
  }

  // Update .env file
  const envPath = path.join(__dirname, ".env");
  let envContent = "";

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf8");
  }

  // Remove existing EMAIL_USER and EMAIL_PASS lines
  envContent = envContent.replace(/^EMAIL_USER=.*$/gm, "");
  envContent = envContent.replace(/^EMAIL_PASS=.*$/gm, "");

  // Remove empty lines
  envContent = envContent.replace(/\n\s*\n/g, "\n");

  // Add new configuration
  envContent += `\n# Email Configuration for Issue Status Notifications\n`;
  envContent += `EMAIL_USER=${emailUser}\n`;
  envContent += `EMAIL_PASS=${emailPass}\n`;

  try {
    fs.writeFileSync(envPath, envContent);
    console.log("✅ Email configuration saved to .env file");

    // Reload environment variables
    delete process.env.EMAIL_USER;
    delete process.env.EMAIL_PASS;
    require("dotenv").config();

    return true;
  } catch (error) {
    console.log("❌ Failed to save configuration:", error.message);
    return false;
  }
};

const testEmailConnection = async () => {
  console.log("🧪 Testing email connection...");
  console.log("");

  const testEmail = await question(
    "Enter a test email address to send a test message: "
  );

  if (!validateEmail(testEmail)) {
    console.log("❌ Invalid email format.");
    return false;
  }

  const testData = {
    userEmail: testEmail,
    userName: "Test User",
    userFirstName: "Test",
    userLastName: "User",
    issueId: 999,
    issueTitle: "Test Issue - Email Configuration Verification",
    issueDescription:
      "This is a test email to verify that the email notification system is working correctly. If you receive this email, the configuration is successful!",
    previousStatus: "Test Status",
    newStatus: "Configuration Verified",
    authorityName: "System Administrator",
    categoryName: "System Test",
    urgencyScore: 5.0,
    updatedAt: new Date(),
    issueCreatedAt: new Date(),
  };

  try {
    console.log("📤 Sending test email...");
    const result = await sendIssueStatusUpdateEmail(testData);

    if (result) {
      console.log("✅ Test email sent successfully!");
      console.log(`   Check ${testEmail} for the test message.`);
      console.log("   Don't forget to check the spam/junk folder.");
      return true;
    } else {
      console.log("❌ Failed to send test email.");
      return false;
    }
  } catch (error) {
    console.log("❌ Error sending test email:", error.message);
    return false;
  }
};

const showUsageInfo = () => {
  console.log("📚 Usage Information:");
  console.log("");
  console.log("🔧 API Endpoint:");
  console.log("   PUT /api/v1/issues/update-status/{issue_id}");
  console.log('   Body: { "status_id": 2 }');
  console.log("");
  console.log("📧 Email Triggers:");
  console.log("   ✓ Automatic when status is updated via API");
  console.log("   ✓ Includes complete issue information");
  console.log("   ✓ Status-specific messaging and next steps");
  console.log("");
  console.log("🛠️  Testing:");
  console.log("   node test-issue-status-email.js");
  console.log("");
  console.log("📄 Documentation:");
  console.log("   See ISSUE_STATUS_EMAIL_SYSTEM.md for complete details");
};

const main = async () => {
  console.log("🚀 GovPulse Email Configuration Setup");
  console.log("=" * 50);
  console.log("");

  try {
    const hasConfig = checkCurrentConfig();

    if (!hasConfig) {
      console.log("🔧 Let's set up your email configuration...");
      console.log("");

      const setupSuccess = await setupEmailConfig();
      if (!setupSuccess) {
        console.log("❌ Setup failed. Please try again.");
        rl.close();
        return;
      }
    }

    console.log("Would you like to test the email configuration? (y/n): ");
    const testChoice = await question("");

    if (
      testChoice.toLowerCase() === "y" ||
      testChoice.toLowerCase() === "yes"
    ) {
      const testSuccess = await testEmailConnection();

      if (testSuccess) {
        console.log("");
        console.log("🎉 Email system is ready!");
        console.log(
          "   The issue status update notifications will now work automatically."
        );
      } else {
        console.log("");
        console.log("⚠️  Email test failed. Please check your configuration.");
        console.log("   You may need to:");
        console.log("   - Verify your email credentials");
        console.log("   - Check your internet connection");
        console.log("   - Enable App Passwords for Gmail");
      }
    }

    console.log("");
    showUsageInfo();
  } catch (error) {
    console.log("💥 Unexpected error:", error.message);
  } finally {
    rl.close();
  }
};

// Run setup if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = {
  checkCurrentConfig,
  setupEmailConfig,
  testEmailConnection,
  main,
};
