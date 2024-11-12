#######################
# Step 1: Build Stage #
#######################
FROM node:20 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install production dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Run the build process to compile TypeScript to JavaScript into the dist folder
RUN npm run build

############################
# Step 2: Production Stage #
############################
FROM node:20-alpine AS production

# Set the working directory in the container
WORKDIR /app

# Copy only necessary files from the build stage
COPY --from=build /app/dist ./
COPY --from=build /app/package*.json ./

# Install only production dependencies
RUN npm install --production

# Expose the port the app will run on
EXPOSE 3001

# Set environment variables
ENV NODE_ENV="prod"

# Start the Node.js application
CMD ["node", "index.js"]
