FROM node:22.11.0
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend .
CMD ["npm", "start"]