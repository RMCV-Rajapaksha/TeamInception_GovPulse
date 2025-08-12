const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.BACKEND_PORT || 4000;
const issueRouter = require("./routes/IssueRouter");
const userRouter = require("./routes/UserRouter");
const generateImageSignatureRouter = require("./routes/GenerateImageSignatureRouter");
app.use(cors());
app.use(express.json());

app.use("/api/issues", issueRouter);
app.use("/api/users", userRouter);
app.use("/api/generate-image-signature", generateImageSignatureRouter);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(process.env.DATABASE_URL);
});
