FROM node:18-alpine as build

WORKDIR /app
# Copy all files to the container (unless they are ignored by .dockerignore)
COPY . .
# Install all dependencies and build the production code
RUN npm install
RUN npm run build

FROM node:18-alpine as deploy

COPY --from=build app/package.json ./
COPY --from=build app/package-lock.json ./

# Install only the production dependencies (like dotenv etc.)
RUN npm ci --omit dev

# The only other files needed are the production code inside the build output
COPY --from=build app/build ./build

EXPOSE 5174

# Start the app and use dotenv to load the environment variables from the .env file
# (this is needed because .env files are not automatically loaded in production)
ENTRYPOINT [ "node", "-r" , "dotenv/config", "build/index.js"]
