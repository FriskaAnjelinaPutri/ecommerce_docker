#gunakan imag nod js versi 18
FROM node:18-alpine

#set working directory didalam container
WORKDIR /app

#salin file package.json kedalam container
COPY package.json . /app/

#install dependencies
RUN npm install

#salin semua file kedalam container
COPY . .

#expose port 3000
EXPOSE 3000

#jalankan aplikasi
CMD ["npm", "start"]
