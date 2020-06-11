FROM node:carbon
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "install", "-g", "sequelize-cli"]
CMD ["npm", "run", "start-server"]
CMD ["sequelize", "db:seed:all"]