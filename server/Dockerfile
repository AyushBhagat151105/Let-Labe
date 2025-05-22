FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install

# Copy all application files (including .env if present)
COPY . .

# Generate Prisma client AFTER copying all files
RUN npx prisma generate

# Expose the application's port
EXPOSE 8080

# Start the application
CMD ["sh", "-c", "npx prisma migrate deploy && node src/app.js"]