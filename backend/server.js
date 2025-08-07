const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.BACKEND_PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api", (req, res) => {
  res.json({ message: "This is for trying out!" });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
