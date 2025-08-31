FROM node:20-alpine

WORKDIR /app

# Expose ports
EXPOSE 5173
EXPOSE 5174

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Start development server
CMD ["npm", "run", "dev", "--", "--config", "vite.config.docker.ts", "--host", "0.0.0.0"]
