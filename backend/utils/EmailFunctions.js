const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Existing function - kept for backward compatibility
const sendScheduleConfirmationEmail = async (userData) => {
  const { Name, Email, date, timeslot, authority } = userData;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: Email,
    subject: `Time Slot Scheduled with ${authority}`,
    text: `Hello ${Name},

You have successfully scheduled a time slot with ${authority}.

Date: ${date}
Time Slot: ${timeslot}

If you need to make changes or have questions, please contact ${authority} directly.

Best regards,
Your Team
    `,
    html: `
      <h1>Time Slot Scheduled</h1>
      <p>Hello <strong>${Name}</strong>,</p>
      <p>You have successfully scheduled a time slot with <strong>${authority}</strong>.</p>
      <h2>Booking Details:</h2>
      <ul>
        <li><strong>Date:</strong> ${date}</li>
        <li><strong>Time Slot:</strong> ${timeslot}</li>
      </ul>
      <p>If you need to make changes or have questions, please contact <strong>${authority}</strong> directly.</p>
      <p>Best regards,</p>
      <p>Your Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Schedule confirmation email sent successfully");
  } catch (error) {
    console.error("Error sending schedule confirmation email:", error);
  }
};

// New automated notification functions

// 1. Appointment Confirmation Email
const sendAppointmentConfirmationEmail = async (appointmentData) => {
  const {
    userEmail,
    userName,
    authorityName,
    date,
    timeSlot,
    issueTitle,
    appointmentId,
  } = appointmentData;

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Appointment Confirmed - ${authorityName}`,
    text: `Hello ${userName},

Your appointment has been successfully confirmed!

Appointment Details:
- Authority: ${authorityName}
- Date: ${formattedDate}
- Time: ${timeSlot}
- Appointment ID: ${appointmentId}
${issueTitle ? `- Related Issue: ${issueTitle}` : ""}

You will receive a reminder email 24 hours before your appointment with a checklist of required documents.

If you need to make changes or have questions, please contact ${authorityName} directly.

Best regards,
GovPulse Team
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb; text-align: center;">Appointment Confirmed</h1>
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p>Hello <strong>${userName}</strong>,</p>
          <p style="color: #16a34a; font-weight: bold;">✓ Your appointment has been successfully confirmed!</p>
        </div>
        
        <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h2 style="color: #1e40af; margin-top: 0;">Appointment Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Authority:</td>
              <td style="padding: 8px 0;">${authorityName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Date:</td>
              <td style="padding: 8px 0;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Time:</td>
              <td style="padding: 8px 0;">${timeSlot}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Appointment ID:</td>
              <td style="padding: 8px 0;">#${appointmentId}</td>
            </tr>
            ${
              issueTitle
                ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Related Issue:</td>
              <td style="padding: 8px 0;">${issueTitle}</td>
            </tr>
            `
                : ""
            }
          </table>
        </div>

        <div style="background-color: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #92400e;">
            <strong>📝 Note:</strong> You will receive a reminder email 24 hours before your appointment with a checklist of required documents to bring.
          </p>
        </div>

        <p>If you need to make changes or have questions, please contact <strong>${authorityName}</strong> directly.</p>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b;">Best regards,<br><strong>GovPulse Team</strong></p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Appointment confirmation email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error("Error sending appointment confirmation email:", error);
    return false;
  }
};

// 2. 24-Hour Reminder Email with Document Checklist
const sendAppointmentReminderEmail = async (appointmentData) => {
  const {
    userEmail,
    userName,
    authorityName,
    date,
    timeSlot,
    issueTitle,
    appointmentId,
    authorityCategory,
  } = appointmentData;

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Document checklist based on authority category
  const getDocumentChecklist = (category) => {
    const commonDocuments = [
      "Valid National Identity Card (NIC)",
      "Appointment confirmation (this email or SMS)",
      "Any previous correspondence related to your issue",
    ];

    const categorySpecificDocuments = {
      Education: [
        "School certificates or transcripts",
        "Birth certificate",
        "Passport-size photographs",
      ],
      Health: [
        "Medical reports or test results",
        "Previous prescriptions",
        "Insurance documents (if applicable)",
      ],
      Transport: [
        "Driving license (if applicable)",
        "Vehicle registration documents",
        "Insurance certificates",
      ],
      Housing: ["Property documents", "Utility bills", "Income certificate"],
      Agriculture: [
        "Land ownership documents",
        "Farming certificates",
        "Previous subsidy documents",
      ],
      "Social Welfare": [
        "Income certificate",
        "Family composition certificate",
        "Bank account details",
      ],
    };

    return [
      ...commonDocuments,
      ...(categorySpecificDocuments[category] || [
        "Relevant supporting documents",
        "Previous applications or forms",
        "Proof of address",
      ]),
    ];
  };

  const documentList = getDocumentChecklist(authorityCategory);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Reminder: Appointment Tomorrow - ${authorityName}`,
    text: `Hello ${userName},

This is a reminder that you have an appointment scheduled for tomorrow.

Appointment Details:
- Authority: ${authorityName}
- Date: ${formattedDate}
- Time: ${timeSlot}
- Appointment ID: ${appointmentId}
${issueTitle ? `- Related Issue: ${issueTitle}` : ""}

IMPORTANT - Please bring the following original documents:

${documentList.map((doc) => `• ${doc}`).join("\n")}

Additional Tips:
• Arrive 15 minutes early
• Bring photocopies of all documents
• Keep your phone accessible for any verification calls
• Dress appropriately for a government office visit

If you need to cancel or reschedule, please do so as soon as possible.

Best regards,
GovPulse Team
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #dc2626; text-align: center;">⏰ Appointment Reminder</h1>
        
        <div style="background-color: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <p style="margin: 0; color: #dc2626; font-weight: bold; font-size: 18px;">
            📅 You have an appointment scheduled for TOMORROW!
          </p>
        </div>

        <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h2 style="color: #1e40af; margin-top: 0;">Appointment Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Citizen:</td>
              <td style="padding: 8px 0;">${userName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Authority:</td>
              <td style="padding: 8px 0;">${authorityName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Date:</td>
              <td style="padding: 8px 0; color: #dc2626; font-weight: bold;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Time:</td>
              <td style="padding: 8px 0; color: #dc2626; font-weight: bold;">${timeSlot}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Appointment ID:</td>
              <td style="padding: 8px 0;">#${appointmentId}</td>
            </tr>
            ${
              issueTitle
                ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Related Issue:</td>
              <td style="padding: 8px 0;">${issueTitle}</td>
            </tr>
            `
                : ""
            }
          </table>
        </div>

        <div style="background-color: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h2 style="color: #92400e; margin-top: 0;">📋 Required Documents Checklist</h2>
          <p style="color: #92400e; font-weight: bold; margin-bottom: 15px;">Please bring ALL original documents listed below:</p>
          <ul style="color: #92400e; margin: 0; padding-left: 20px;">
            ${documentList
              .map((doc) => `<li style="margin-bottom: 5px;">${doc}</li>`)
              .join("")}
          </ul>
        </div>

        <div style="background-color: #ecfdf5; border: 1px solid #34d399; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #047857; margin-top: 0;">💡 Additional Tips</h3>
          <ul style="color: #047857; margin: 0; padding-left: 20px;">
            <li style="margin-bottom: 8px;">✓ Arrive 15 minutes early</li>
            <li style="margin-bottom: 8px;">✓ Bring photocopies of all documents</li>
            <li style="margin-bottom: 8px;">✓ Keep your phone accessible for verification calls</li>
            <li style="margin-bottom: 8px;">✓ Dress appropriately for a government office visit</li>
          </ul>
        </div>

        <div style="background-color: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #dc2626; text-align: center;">
            <strong>⚠️ Important:</strong> If you need to cancel or reschedule, please do so as soon as possible.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b;">Best regards,<br><strong>GovPulse Team</strong></p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Appointment reminder email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error("Error sending appointment reminder email:", error);
    return false;
  }
};

// 3. Status Update Email from Officials
const sendStatusUpdateEmail = async (updateData) => {
  const {
    userEmail,
    userName,
    authorityName,
    officialName,
    appointmentId,
    updateType, // 'comment', 'request', 'reschedule', 'cancel', 'completion'
    message,
    date,
    timeSlot,
    newDate = null,
    newTimeSlot = null,
  } = updateData;

  const getUpdateTitle = (type) => {
    switch (type) {
      case "comment":
        return "New Comment on Your Appointment";
      case "request":
        return "Document Request for Your Appointment";
      case "reschedule":
        return "Appointment Rescheduled";
      case "cancel":
        return "Appointment Cancelled";
      case "completion":
        return "Appointment Completed";
      default:
        return "Appointment Update";
    }
  };

  const getUpdateIcon = (type) => {
    switch (type) {
      case "comment":
        return "💬";
      case "request":
        return "📋";
      case "reschedule":
        return "📅";
      case "cancel":
        return "❌";
      case "completion":
        return "✅";
      default:
        return "📢";
    }
  };

  const getUpdateColor = (type) => {
    switch (type) {
      case "comment":
        return "#2563eb";
      case "request":
        return "#ea580c";
      case "reschedule":
        return "#7c3aed";
      case "cancel":
        return "#dc2626";
      case "completion":
        return "#16a34a";
      default:
        return "#64748b";
    }
  };

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedNewDate = newDate
    ? new Date(newDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `${getUpdateTitle(updateType)} - Appointment #${appointmentId}`,
    text: `Hello ${userName},

You have received an update regarding your appointment with ${authorityName}.

${getUpdateTitle(updateType)}

Appointment Details:
- Appointment ID: ${appointmentId}
- Authority: ${authorityName}
- Official: ${officialName}
- Original Date: ${formattedDate}
- Original Time: ${timeSlot}

${
  updateType === "reschedule" && newDate && newTimeSlot
    ? `
New Schedule:
- New Date: ${formattedNewDate}
- New Time: ${newTimeSlot}
`
    : ""
}

Update Message:
${message}

${
  updateType === "request"
    ? `
Please prepare the requested documents and bring them to your appointment.
`
    : ""
}

${
  updateType === "reschedule"
    ? `
Your appointment has been rescheduled. Please make note of the new date and time.
`
    : ""
}

${
  updateType === "cancel"
    ? `
Your appointment has been cancelled. If you need to reschedule, please contact the authority directly or book a new appointment through the GovPulse platform.
`
    : ""
}

For any questions, please contact ${authorityName} directly.

Best regards,
GovPulse Team
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: ${getUpdateColor(updateType)}; text-align: center;">
          ${getUpdateIcon(updateType)} ${getUpdateTitle(updateType)}
        </h1>
        
        <div style="background-color: #f8fafc; border-left: 4px solid ${getUpdateColor(
          updateType
        )}; padding: 20px; margin: 20px 0;">
          <p>Hello <strong>${userName}</strong>,</p>
          <p>You have received an update regarding your appointment with <strong>${authorityName}</strong>.</p>
        </div>

        <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h2 style="color: #1e40af; margin-top: 0;">Appointment Information</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Appointment ID:</td>
              <td style="padding: 8px 0;">#${appointmentId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Authority:</td>
              <td style="padding: 8px 0;">${authorityName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Official:</td>
              <td style="padding: 8px 0;">${officialName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Original Date:</td>
              <td style="padding: 8px 0;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Original Time:</td>
              <td style="padding: 8px 0;">${timeSlot}</td>
            </tr>
            ${
              updateType === "reschedule" && newDate && newTimeSlot
                ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">New Date:</td>
              <td style="padding: 8px 0; color: #7c3aed; font-weight: bold;">${formattedNewDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">New Time:</td>
              <td style="padding: 8px 0; color: #7c3aed; font-weight: bold;">${newTimeSlot}</td>
            </tr>
            `
                : ""
            }
          </table>
        </div>

        <div style="background-color: #f1f5f9; border: 1px solid ${getUpdateColor(
          updateType
        )}; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: ${getUpdateColor(
            updateType
          )}; margin-top: 0;">Update Details</h3>
          <p style="background-color: white; padding: 15px; border-radius: 4px; margin: 0; white-space: pre-line;">${message}</p>
        </div>

        ${
          updateType === "request"
            ? `
        <div style="background-color: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #92400e;">
            <strong>📋 Action Required:</strong> Please prepare the requested documents and bring them to your appointment.
          </p>
        </div>
        `
            : ""
        }

        ${
          updateType === "reschedule"
            ? `
        <div style="background-color: #f3e8ff; border: 1px solid #a855f7; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #7c2d12;">
            <strong>📅 Schedule Change:</strong> Your appointment has been rescheduled. Please make note of the new date and time above.
          </p>
        </div>
        `
            : ""
        }

        ${
          updateType === "cancel"
            ? `
        <div style="background-color: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #dc2626;">
            <strong>❌ Appointment Cancelled:</strong> If you need to reschedule, please contact the authority directly or book a new appointment through the GovPulse platform.
          </p>
        </div>
        `
            : ""
        }

        <p>For any questions, please contact <strong>${authorityName}</strong> directly.</p>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b;">Best regards,<br><strong>GovPulse Team</strong></p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(
      `Status update email sent to ${userEmail} for appointment ${appointmentId}`
    );
    return true;
  } catch (error) {
    console.error("Error sending status update email:", error);
    return false;
  }
};

// 4. Issue Status Update Email
const sendIssueStatusUpdateEmail = async (issueData) => {
  const {
    userEmail,
    userName,
    userFirstName,
    userLastName,
    issueId,
    issueTitle,
    issueDescription,
    previousStatus,
    newStatus,
    authorityName,
    categoryName,
    urgencyScore,
    updatedAt,
    issueCreatedAt,
  } = issueData;
  console.log("print email------------------------");
  // Use full name if available, otherwise use email
  const displayName =
    userFirstName && userLastName
      ? `${userFirstName} ${userLastName}`
      : userName || userEmail;

  const getStatusColor = (status) => {
    const statusLower = status.toLowerCase();
    if (
      statusLower.includes("completed") ||
      statusLower.includes("resolved") ||
      statusLower.includes("closed")
    ) {
      return "#16a34a"; // green
    } else if (
      statusLower.includes("assigned") ||
      statusLower.includes("progress") ||
      statusLower.includes("working")
    ) {
      return "#2563eb"; // blue
    } else if (
      statusLower.includes("pending") ||
      statusLower.includes("review")
    ) {
      return "#ea580c"; // orange
    } else if (
      statusLower.includes("rejected") ||
      statusLower.includes("cancelled")
    ) {
      return "#dc2626"; // red
    } else {
      return "#64748b"; // gray
    }
  };

  const getStatusIcon = (status) => {
    const statusLower = status.toLowerCase();
    if (
      statusLower.includes("completed") ||
      statusLower.includes("resolved") ||
      statusLower.includes("closed")
    ) {
      return "✅";
    } else if (
      statusLower.includes("assigned") ||
      statusLower.includes("progress") ||
      statusLower.includes("working")
    ) {
      return "🔄";
    } else if (
      statusLower.includes("pending") ||
      statusLower.includes("review")
    ) {
      return "⏳";
    } else if (
      statusLower.includes("rejected") ||
      statusLower.includes("cancelled")
    ) {
      return "❌";
    } else {
      return "📋";
    }
  };

  const getUrgencyLabel = (urgency) => {
    if (urgency >= 8) return { label: "Critical", color: "#dc2626" };
    if (urgency >= 6) return { label: "High", color: "#ea580c" };
    if (urgency >= 4) return { label: "Medium", color: "#ca8a04" };
    return { label: "Low", color: "#65a30d" };
  };

  const urgencyInfo = getUrgencyLabel(urgencyScore);
  const statusColor = getStatusColor(newStatus);
  const statusIcon = getStatusIcon(newStatus);

  const formattedCreatedDate = new Date(issueCreatedAt).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const formattedUpdatedDate = new Date(updatedAt).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Issue Status Updated: ${issueTitle} - #${issueId}`,
    text: `Hello ${displayName},

Your issue status has been updated by ${authorityName}.

${statusIcon} Status Update: ${newStatus}

Issue Details:
- Issue ID: #${issueId}
- Title: ${issueTitle}
- Category: ${categoryName}
- Authority: ${authorityName}
- Urgency Level: ${urgencyInfo.label} (${urgencyScore}/10)
- Previous Status: ${previousStatus}
- New Status: ${newStatus}
- Updated: ${formattedUpdatedDate}

Issue Description:
${issueDescription}

What this means:
${
  newStatus.toLowerCase().includes("completed") ||
  newStatus.toLowerCase().includes("resolved")
    ? `✅ Great news! Your issue has been resolved. The authority has completed the necessary actions for your concern.`
    : newStatus.toLowerCase().includes("assigned") ||
      newStatus.toLowerCase().includes("progress") ||
      newStatus.toLowerCase().includes("working")
    ? `🔄 Your issue is now being actively worked on by the assigned team. You should expect further updates soon.`
    : newStatus.toLowerCase().includes("pending") ||
      newStatus.toLowerCase().includes("review")
    ? `⏳ Your issue is under review. The authority is evaluating your request and will provide updates as they become available.`
    : newStatus.toLowerCase().includes("rejected") ||
      newStatus.toLowerCase().includes("cancelled")
    ? `❌ Your issue request has been declined. If you believe this is an error, please contact the authority directly for clarification.`
    : `📋 Your issue status has been updated. Please check the GovPulse platform for more details.`
}

Next Steps:
${
  newStatus.toLowerCase().includes("completed") ||
  newStatus.toLowerCase().includes("resolved")
    ? `- If you're satisfied with the resolution, no further action is needed.
- If you have additional concerns, you may submit a new issue.
- Consider providing feedback about your experience.`
    : newStatus.toLowerCase().includes("assigned") ||
      newStatus.toLowerCase().includes("progress") ||
      newStatus.toLowerCase().includes("working")
    ? `- Monitor your issue for further updates.
- Be prepared to provide additional information if requested.
- You may receive a request for an appointment to discuss details.`
    : newStatus.toLowerCase().includes("pending") ||
      newStatus.toLowerCase().includes("review")
    ? `- Please be patient while your issue is being reviewed.
- Ensure all required information was provided in your original submission.
- Additional documentation may be requested.`
    : `- Check the GovPulse platform for detailed updates.
- Contact ${authorityName} if you have questions about this status change.`
}

You can track your issue progress by logging into the GovPulse platform and viewing your submitted issues.

For any questions regarding this update, please contact ${authorityName} directly.

Best regards,
GovPulse Team
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: ${statusColor}; text-align: center;">
          ${statusIcon} Issue Status Updated
        </h1>
        
        <div style="background-color: #f8fafc; border-left: 4px solid ${statusColor}; padding: 20px; margin: 20px 0;">
          <p>Hello <strong>${displayName}</strong>,</p>
          <p>Your issue status has been updated by <strong>${authorityName}</strong>.</p>
        </div>

        <div style="background-color: ${statusColor}15; border: 1px solid ${statusColor}; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
          <h2 style="color: ${statusColor}; margin: 0; font-size: 24px;">
            ${statusIcon} ${newStatus}
          </h2>
          <p style="margin: 8px 0 0 0; color: #64748b;">New Status</p>
        </div>

        <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h2 style="color: #1e40af; margin-top: 0;">Issue Information</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569; width: 140px;">Issue ID:</td>
              <td style="padding: 8px 0;">#${issueId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Title:</td>
              <td style="padding: 8px 0; font-weight: bold;">${issueTitle}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Category:</td>
              <td style="padding: 8px 0;">${categoryName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Authority:</td>
              <td style="padding: 8px 0;">${authorityName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Urgency Level:</td>
              <td style="padding: 8px 0;">
                <span style="background-color: ${urgencyInfo.color}20; color: ${
      urgencyInfo.color
    }; padding: 4px 8px; border-radius: 4px; font-weight: bold;">
                  ${urgencyInfo.label} (${urgencyScore}/10)
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Previous Status:</td>
              <td style="padding: 8px 0; color: #64748b;">${previousStatus}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">New Status:</td>
              <td style="padding: 8px 0; color: ${statusColor}; font-weight: bold;">${newStatus}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Created:</td>
              <td style="padding: 8px 0;">${formattedCreatedDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #475569;">Last Updated:</td>
              <td style="padding: 8px 0; font-weight: bold;">${formattedUpdatedDate}</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #334155; margin-top: 0;">Issue Description</h3>
          <p style="background-color: white; padding: 15px; border-radius: 4px; margin: 0; line-height: 1.6;">${issueDescription}</p>
        </div>

        <div style="background-color: ${
          newStatus.toLowerCase().includes("completed") ||
          newStatus.toLowerCase().includes("resolved")
            ? "#f0fdf4"
            : newStatus.toLowerCase().includes("assigned") ||
              newStatus.toLowerCase().includes("progress") ||
              newStatus.toLowerCase().includes("working")
            ? "#eff6ff"
            : newStatus.toLowerCase().includes("pending") ||
              newStatus.toLowerCase().includes("review")
            ? "#fff7ed"
            : "#fef2f2"
        }; 
          border: 1px solid ${
            newStatus.toLowerCase().includes("completed") ||
            newStatus.toLowerCase().includes("resolved")
              ? "#bbf7d0"
              : newStatus.toLowerCase().includes("assigned") ||
                newStatus.toLowerCase().includes("progress") ||
                newStatus.toLowerCase().includes("working")
              ? "#bfdbfe"
              : newStatus.toLowerCase().includes("pending") ||
                newStatus.toLowerCase().includes("review")
              ? "#fed7aa"
              : "#fecaca"
          }; 
          border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: ${statusColor}; margin-top: 0;">What this means</h3>
          <p style="margin: 0; color: #374151; line-height: 1.6;">
            ${
              newStatus.toLowerCase().includes("completed") ||
              newStatus.toLowerCase().includes("resolved")
                ? `✅ <strong>Great news!</strong> Your issue has been resolved. The authority has completed the necessary actions for your concern.`
                : newStatus.toLowerCase().includes("assigned") ||
                  newStatus.toLowerCase().includes("progress") ||
                  newStatus.toLowerCase().includes("working")
                ? `🔄 <strong>In Progress:</strong> Your issue is now being actively worked on by the assigned team. You should expect further updates soon.`
                : newStatus.toLowerCase().includes("pending") ||
                  newStatus.toLowerCase().includes("review")
                ? `⏳ <strong>Under Review:</strong> Your issue is under review. The authority is evaluating your request and will provide updates as they become available.`
                : newStatus.toLowerCase().includes("rejected") ||
                  newStatus.toLowerCase().includes("cancelled")
                ? `❌ <strong>Request Declined:</strong> Your issue request has been declined. If you believe this is an error, please contact the authority directly for clarification.`
                : `📋 <strong>Status Updated:</strong> Your issue status has been updated. Please check the GovPulse platform for more details.`
            }
          </p>
        </div>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #1e40af; margin-top: 0;">📋 Next Steps</h3>
          <ul style="color: #374151; margin: 0; padding-left: 20px; line-height: 1.8;">
            ${
              newStatus.toLowerCase().includes("completed") ||
              newStatus.toLowerCase().includes("resolved")
                ? `<li>If you're satisfied with the resolution, no further action is needed.</li>
                 <li>If you have additional concerns, you may submit a new issue.</li>
                 <li>Consider providing feedback about your experience.</li>`
                : newStatus.toLowerCase().includes("assigned") ||
                  newStatus.toLowerCase().includes("progress") ||
                  newStatus.toLowerCase().includes("working")
                ? `<li>Monitor your issue for further updates.</li>
                 <li>Be prepared to provide additional information if requested.</li>
                 <li>You may receive a request for an appointment to discuss details.</li>`
                : newStatus.toLowerCase().includes("pending") ||
                  newStatus.toLowerCase().includes("review")
                ? `<li>Please be patient while your issue is being reviewed.</li>
                 <li>Ensure all required information was provided in your original submission.</li>
                 <li>Additional documentation may be requested.</li>`
                : `<li>Check the GovPulse platform for detailed updates.</li>
                 <li>Contact ${authorityName} if you have questions about this status change.</li>`
            }
          </ul>
        </div>

        <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 15px; margin: 20px 0; text-align: center;">
          <p style="margin: 0; color: #1d4ed8;">
            <strong>💻 Track Your Progress:</strong> Log into the GovPulse platform to view detailed updates and manage your issues.
          </p>
        </div>

        <p style="color: #64748b;">For any questions regarding this update, please contact <strong>${authorityName}</strong> directly.</p>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b;">Best regards,<br><strong>GovPulse Team</strong></p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(
      `Issue status update email sent to ${userEmail} for issue #${issueId}`
    );
    return true;
  } catch (error) {
    console.error("Error sending issue status update email:", error);
    return false;
  }
};

module.exports = {
  sendScheduleConfirmationEmail,
  sendAppointmentConfirmationEmail,
  sendAppointmentReminderEmail,
  sendStatusUpdateEmail,
  sendIssueStatusUpdateEmail,
};





