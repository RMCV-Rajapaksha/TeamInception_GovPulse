# Use official Node.js image as the base
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./


# Install build dependencies for native modules (canvas, bcrypt, etc.)
RUN apk add --no-cache \
	python3 \
	make \
	g++ \
	pkgconfig \
	cairo-dev \
	pango-dev \
	jpeg-dev \
	giflib-dev \
	pixman-dev \
	musl-dev \
	libpng-dev \
	udev \
	build-base

# Install node dependencies
RUN npm install --production


# Copy the rest of the application code
COPY . .


# Expose the port the app runs on
EXPOSE 3000


# Start the server
CMD ["node", "server.js"]
