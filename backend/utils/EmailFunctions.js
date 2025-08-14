const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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

module.exports = {
  sendScheduleConfirmationEmail,
};
