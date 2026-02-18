# Use official Node.js LTS image
FROM node:18-alpine
WORKDIR /app

# Accept build arg for API URL
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

COPY package.json .
COPY tsconfig.json .
COPY public ./public
COPY src ./src
ENV NODE_OPTIONS=--openssl-legacy-provider
EXPOSE 3000
RUN rm -rf node_modules && npm install -g ajv@6.12.6 && npm install --legacy-peer-deps

# Build production bundle with correct API URL
RUN npm run build

# Serve production build by default
CMD ["npx", "serve", "-s", "build", "-l", "3000"]