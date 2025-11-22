# Pakai base image Node.js
FROM node:18

# Set working directory dalam container
WORKDIR /app

# Copy package.json & package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua file project
COPY . .

# Expose port 4000
EXPOSE 4000

# Jalankan aplikasi
CMD ["npm", "start"]
