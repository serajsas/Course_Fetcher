FROM node:alpine

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

RUN npm install

EXPOSE ${SERVER_PORT}

CMD [ "npm", "run"]
