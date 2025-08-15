const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const YAML = require("yaml");
require("dotenv").config();

// Initialize notification service
// const notificationService = require("./utils/NotificationService");

const app = express();
const port = process.env.BACKEND_PORT || 4000;
// v1 routers
const issueRouterV1 = require("./routes/v1/IssueRouter");
const userRouterV1 = require("./routes/v1/UserRouter");
const officialRouterV1 = require("./routes/v1/OfficialRouter");
const timeSlotRouterV1 = require("./routes/v1/TimeSlotRouter");
const appointmentRouterV1 = require("./routes/v1/AppointmentRouter");
const AuthorityRouterV1 = require("./routes/v1/AuthorityRouter");
const generateImageSignatureRouterV1 = require("./routes/v1/GenerateImageSignatureRouter");
const imageUploadRouterV1 = require("./routes/v1/ImageUploadRouter");
const upvoteRouterV1 = require("./routes/v1/UpvoteRouter");
const commentRouterV1 = require("./routes/v1/CommentRouter");
const feedbackRouterV1 = require("./routes/v1/FeedbackRouter");

// v2 routers
const issueRouterV2 = require("./routes/v2/IssueRouter");
const userRouterV2 = require("./routes/v2/UserRouter");
const officialRouterV2 = require("./routes/v2/OfficialRouter");
const timeSlotRouterV2 = require("./routes/v2/TimeSlotRouter");
const appointmentRouterV2 = require("./routes/v2/AppointmentRouter");
const AuthorityRouterV2 = require("./routes/v2/AuthorityRouter");
const generateImageSignatureRouterV2 = require("./routes/v2/GenerateImageSignatureRouter");
const imageUploadRouterV2 = require("./routes/v2/ImageUploadRouter");
const upvoteRouterV2 = require("./routes/v2/UpvoteRouter");
const commentRouterV2 = require("./routes/v2/CommentRouter");
const feedbackRouterV2 = require("./routes/v2/FeedbackRouter");

// Load OpenAPI specification
const swaggerDocumentV1 = YAML.parse(
  fs.readFileSync("./openapi-spec-v1.yaml", "utf8")
);
const swaggerDocumentV2 = YAML.parse(
  fs.readFileSync("./openapi-spec-v2.yaml", "utf8")
);
// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  console.log("Request Headers:", req.headers);
  next();
});
// v1 routes
app.use("/api/v1/issues", issueRouterV1);
app.use("/api/v1/users", userRouterV1);
app.use("/api/v1/officials", officialRouterV1);
app.use("/api/v1/time-slots", timeSlotRouterV1);
app.use("/api/v1/appointments", appointmentRouterV1);
app.use("/api/v1/authorities", AuthorityRouterV1);
app.use("/api/v1/generate-image-signature", generateImageSignatureRouterV1);
app.use("/api/v1/upload-image", imageUploadRouterV1);
app.use("/api/v1/upvotes", upvoteRouterV1);
app.use("/api/v1/comments", commentRouterV1);
app.use("/api/v1/feedback", feedbackRouterV1);

// v2 routes
app.use("/api/v2/issues", issueRouterV2);
app.use("/api/v2/users", userRouterV2);
app.use("/api/v2/officials", officialRouterV2);
app.use("/api/v2/time-slots", timeSlotRouterV2);
app.use("/api/v2/appointments", appointmentRouterV2);
app.use("/api/v2/authorities", AuthorityRouterV2);
app.use("/api/v2/generate-image-signature", generateImageSignatureRouterV2);
app.use("/api/v2/upload-image", imageUploadRouterV2);
app.use("/api/v2/upvotes", upvoteRouterV2);
app.use("/api/v2/comments", commentRouterV2);
app.use("/api/v2/feedback", feedbackRouterV2);

// Swagger UI route
app.use(
  "/api-docs-v1",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocumentV1, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "GovPulse API Documentation",
  })
);

app.use(
  "/api-docs-v2",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocumentV2, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "GovPulse API Documentation v2",
  })
);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "GovPulse Backend API",
    documentation: "Visit /api-docs for interactive API documentation",
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(
    `API Documentation for v1 api available at http://localhost:${port}/api-docs-v1`
  );
  console.log(
    `API Documentation for v2 api available at http://localhost:${port}/api-docs-v2`
  );
});
