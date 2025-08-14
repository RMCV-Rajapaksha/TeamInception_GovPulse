const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.BACKEND_PORT || 4000;
// v1 routers
const issueRouter = require("./routes/IssueRouter");
const userRouter = require("./routes/UserRouter");
const officialRouter = require("./routes/OfficialRouter");
const timeSlotRouter = require("./routes/TimeSlotRouter");
const appointmentRouter = require("./routes/AppointmentRouter");
const AuthorityRouter = require("./routes/AuthorityRouter");
const generateImageSignatureRouter = require("./routes/GenerateImageSignatureRouter");
const imageUploadRouter = require("./routes/ImageUploadRouter");

// v2 routers
const issueRouter = require("./routes/v2/IssueRouter");
const userRouter = require("./routes/v2/UserRouter");
const officialRouter = require("./routes/v2/OfficialRouter");
const timeSlotRouter = require("./routes/v2/TimeSlotRouter");
const appointmentRouter = require("./routes/v2/AppointmentRouter");
const AuthorityRouter = require("./routes/v2/AuthorityRouter");
const generateImageSignatureRouter = require("./routes/v2/GenerateImageSignatureRouter");
const imageUploadRouter = require("./routes/v2/ImageUploadRouter");

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

// v2 routes
app.use("/api/v2/issues", issueRouter);
app.use("/api/v2/users", userRouter);
app.use("/api/v2/officials", officialRouter);
app.use("/api/v2/time-slots", timeSlotRouter);
app.use("/api/v2/appointments", appointmentRouter);
app.use("/api/v2/authorities", AuthorityRouter);
app.use("/api/v2/generate-image-signature", generateImageSignatureRouter);
app.use("/api/v2/upload-image", imageUploadRouter);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
