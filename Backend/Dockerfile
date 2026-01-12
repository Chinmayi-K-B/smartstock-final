# BACKEND DOCKERFILE
FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the backend port
EXPOSE 3001

# Start the server
CMD ["node", "index.js"]