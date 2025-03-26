FROM node:20-alpine as builder

# Create app directory and set permissions
WORKDIR /app
RUN chown -R node:node /app
USER node

# Install dependencies
COPY --chown=node:node package*.json ./
RUN npm ci

# Copy source
COPY --chown=node:node . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install global packages as root
RUN npm install -g serve

RUN chown -R node:node /app
USER node

COPY --from=builder --chown=node:node /app/dist ./dist

EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]