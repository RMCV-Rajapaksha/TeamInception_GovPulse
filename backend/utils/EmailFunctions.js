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

module.exports = {
  sendScheduleConfirmationEmail,
  sendAppointmentConfirmationEmail,
  sendAppointmentReminderEmail,
  sendStatusUpdateEmail,
};
