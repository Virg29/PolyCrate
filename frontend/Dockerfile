FROM node:20-alpine as builder

WORKDIR /app
RUN chown -R node:node /app
USER node

COPY --chown=node:node package*.json ./
RUN npm ci

COPY --chown=node:node . .

RUN chmod +x ./generate-config.sh
RUN ls -al
RUN ./generate-config.sh

# Build
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Create directory for the app
RUN chown -R node:node /app
USER node

# Copy the built assets
COPY --from=builder --chown=node:node /app/dist ./dist


EXPOSE 5173

# Run the config generation script and then start the server
CMD ["/bin/sh", "-c", "pwd && serve -s dist -l 5173"]