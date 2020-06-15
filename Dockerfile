FROM node:10.21.0-jessie
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install -g sequelize-cli
RUN npm install
COPY . .
CMD ["npm", "run", "start-server"]