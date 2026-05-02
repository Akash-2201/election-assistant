# --- Stage 1: Build Frontend ---
FROM node:20-slim AS build-stage
WORKDIR /app

# Copy dependency files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the Vite frontend
RUN npm run build

# --- Stage 2: Production Server ---
FROM node:20-slim AS production-stage
WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# Copy backend dependencies only
COPY package*.json ./
RUN npm install --omit=dev

# Copy backend server file
COPY server.cjs ./

# Copy built frontend assets from build-stage to the public directory
COPY --from=build-stage /app/dist ./dist

# Command to run the server
CMD ["node", "server.cjs"]
