const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.BACKEND_PORT || 3000;
const issueRouter = require("./routes/IssueRouter");
app.use(cors());
app.use(express.json());

app.use("/api/issues", issueRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
