# Use the latest Node.js base image
FROM node:latest AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port (typically 5173 for React apps, adjust if different)
EXPOSE 5173

# Start the app
CMD ["npm", "run" , "dev"]