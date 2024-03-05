
FROM node:20.5.1

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i --production --silent

COPY . .

EXPOSE 3000

CMD ["node", "dist/main.js"]