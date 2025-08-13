const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.BACKEND_PORT || 4000;
const issueRouter = require("./routes/IssueRouter");
const userRouter = require("./routes/UserRouter");
const officialRouter = require("./routes/OfficialRouter");
const timeSlotRouter = require("./routes/TimeSlotRouter");
const generateImageSignatureRouter = require("./routes/GenerateImageSignatureRouter");
const imageUploadRouter = require("./routes/ImageUploadRouter");

app.use(cors());
app.use(express.json());
app.use("/api/issues", issueRouter);
app.use("/api/users", userRouter);
app.use("/api/officials", officialRouter);
app.use("/api/time-slots", timeSlotRouter);
app.use("/api/generate-image-signature", generateImageSignatureRouter);
app.use("/api/upload-image", imageUploadRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
