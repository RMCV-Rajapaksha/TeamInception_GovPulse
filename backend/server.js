const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const YAML = require("yaml");
require("dotenv").config();

const app = express();
const port = process.env.BACKEND_PORT || 4000;

// Load OpenAPI specification
const swaggerDocument = YAML.parse(fs.readFileSync('./openapi.yaml', 'utf8'));

// Import routes
const issueRouter = require("./routes/IssueRouter");
const userRouter = require("./routes/UserRouter");
const officialRouter = require("./routes/OfficialRouter");
const timeSlotRouter = require("./routes/TimeSlotRouter");
const appointmentRouter = require("./routes/AppointmentRouter");
const generateImageSignatureRouter = require("./routes/GenerateImageSignatureRouter");
const imageUploadRouter = require("./routes/ImageUploadRouter");

// Middleware
app.use(cors());
app.use(express.json());

// Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "GovPulse API Documentation"
}));

// API routes
app.use("/api/issues", issueRouter);
app.use("/api/users", userRouter);
app.use("/api/officials", officialRouter);
app.use("/api/time-slots", timeSlotRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/generate-image-signature", generateImageSignatureRouter);
app.use("/api/upload-image", imageUploadRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'GovPulse Backend API',
    documentation: 'Visit /api-docs for interactive API documentation'
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`API Documentation available at http://localhost:${port}/api-docs`);
});
