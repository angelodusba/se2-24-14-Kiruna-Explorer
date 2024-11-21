########################
# Stage 1: Build Stage #
########################
FROM node:20-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Set build arguments and environment variables so Vite can use them during the build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Ensure that VITE_API_URL is specified
RUN if [ -z "$VITE_API_URL" ]; then echo 'Environment variable VITE_API_URL must be specified. Exiting.'; exit 1; fi

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies, including dev dependencies for build
RUN npm install

# Copy the rest of the application files (including source code)
COPY . .

# Run the build process (Vite + TypeScript compilation)
RUN npm run build

#############################
# Stage 2: Production Stage #
#############################
FROM node:20-alpine AS production

# Set the working directory inside the container
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app/dist /app/dist

# Copy only the production dependencies (use --production to avoid dev dependencies)
# COPY --from=build /app/node_modules /app/node_modules

# Install global dependencies required to serve the app
RUN npm i -g serve

# Expose the port the app will run on (e.g., port 3000 for the Node.js app)
EXPOSE 3000

# Serve the app using the "serve" command and the dist directory
CMD ["serve", "-s", "dist"]