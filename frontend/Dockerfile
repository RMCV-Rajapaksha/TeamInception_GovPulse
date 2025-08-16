# Use official Node.js runtime as base image (Ubuntu-based for better Rollup compatibility)
FROM node:18

# Set working directory in container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application for production with relaxed TypeScript checks
RUN npm run build:prod

# Expose the port the app runs on (Vite preview uses 4173 by default)
EXPOSE 4173

# Command to run the application with host binding
CMD ["npm", "run", "preview", "--", "--host"]
