FROM node:20.9.0
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
CMD ["npm", "start"]