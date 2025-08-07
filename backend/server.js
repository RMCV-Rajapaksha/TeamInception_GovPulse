const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.BACKEND_PORT || 4000;
const issueRouter = require("./routes/IssueRouter");
const userRouter = require("./routes/UserRouter");
app.use(cors());
app.use(express.json());

app.use("/api/issues", issueRouter);
app.use("/api/users", userRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
