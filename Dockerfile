FROM node:carbon
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install -g sequelize-cli
RUN npm install
COPY . .
CMD ["sequelize", "db:seed:all"]
CMD ["npm", "run", "start-server"]