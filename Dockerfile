FROM mongo:latest
FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
COPY .env /usr/src/app/.env
RUN npm run build
EXPOSE 3001 27017
CMD ["npm", "start"]
