FROM node:alpine

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

EXPOSE ${SERVER_PORT}

CMD [ "npm", "start"]