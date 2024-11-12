FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Set build arguments and environment variables so Vite can use it during the build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Ensure that VITE_API_URL is specified
RUN if [ -z "$VITE_API_URL" ]; then echo 'Environment variable VITE_API_URL must be specified. Exiting.'; exit 1; fi

# Copy the package.json and package-lock.json files
COPY package.json .

# Install dependencies
RUN npm install --production
RUN npm i -g serve

# Copy the rest of the application files
COPY . .

# Build the app using tsc and Vite
RUN npm run build

# Expose port for Node
EXPOSE 3000

# Serve the app using the port from the build argument
CMD ["serve", "-s", "dist"]