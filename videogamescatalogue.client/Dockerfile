FROM node:20-alpine

WORKDIR /app

# Expose ports
EXPOSE 5173

# Install openssl for certificate generation
RUN apk add --no-cache openssl

# Create certificates directory
RUN mkdir -p certs

# Generate self-signed certificate for development
RUN openssl req -x509 -newkey rsa:4096 -keyout certs/key.pem -out certs/cert.pem -days 365 -nodes \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost" \
    -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Start development server
CMD ["npm", "run", "dev"]
