const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.BACKEND_PORT || 4000;
// v1 routers
const issueRouter = require("./routes/v1/IssueRouter");
const userRouter = require("./routes/v1/UserRouter");
const officialRouter = require("./routes/v1/OfficialRouter");
const timeSlotRouter = require("./routes/v1/TimeSlotRouter");
const appointmentRouter = require("./routes/v1/AppointmentRouter");
const AuthorityRouter = require("./routes/v1/AuthorityRouter");
const generateImageSignatureRouter = require("./routes/v1/GenerateImageSignatureRouter");
const imageUploadRouter = require("./routes/v1/ImageUploadRouter");
const upvoteRouter = require("./routes/v1/UpvoteRoute");

// v2 routers
const issueRouter = require("./routes/v2/IssueRouter");
const userRouter = require("./routes/v2/UserRouter");
const officialRouter = require("./routes/v2/OfficialRouter");
const timeSlotRouter = require("./routes/v2/TimeSlotRouter");
const appointmentRouter = require("./routes/v2/AppointmentRouter");
const AuthorityRouter = require("./routes/v2/AuthorityRouter");
const generateImageSignatureRouter = require("./routes/v2/GenerateImageSignatureRouter");
const imageUploadRouter = require("./routes/v2/ImageUploadRouter");
const upvoteRouter = require("./routes/v2/UpvoteRoute");

app.use(cors());
app.use(express.json());
app.use((req,res,next)=>{
  console.log(`${req.method} request for '${req.url}'`);
  console.log("Request Headers:", req.headers);
  next();
})
// v1 routes
app.use("/api/v1/issues", issueRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/officials", officialRouter);
app.use("/api/v1/time-slots", timeSlotRouter);
app.use("/api/v1/appointments", appointmentRouter);
app.use("/api/v1/authorities", AuthorityRouter);
app.use("/api/v1/generate-image-signature", generateImageSignatureRouter);
app.use("/api/v1/upload-image", imageUploadRouter);
app.use("/api/v1/upvotes", upvoteRouter);

// v2 routes
app.use("/api/v2/issues", issueRouter);
app.use("/api/v2/users", userRouter);
app.use("/api/v2/officials", officialRouter);
app.use("/api/v2/time-slots", timeSlotRouter);
app.use("/api/v2/appointments", appointmentRouter);
app.use("/api/v2/authorities", AuthorityRouter);
app.use("/api/v2/generate-image-signature", generateImageSignatureRouter);
app.use("/api/v2/upload-image", imageUploadRouter);
app.use("/api/v2/upvotes", upvoteRouter);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
