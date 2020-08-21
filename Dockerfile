FROM node:14-buster-slim

EXPOSE 8080

#Create app directory
WORKDIR /usr/app

#Install dependencies
COPY package.json package-lock*.json ./

RUN npm install 

#Bundle app source
COPY . .

CMD ["node", "lib/index.js"]