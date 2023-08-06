# Dockerfile
# Specify the base image
FROM node:18.16.1-alpine3.17

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies in the container
RUN npm install

# Copy app.js into working directory
COPY src/app.js ./

# The application listens on port 3000, so we'll expose that port
EXPOSE 3000
CMD ["node", "app.js"]