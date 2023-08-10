FROM node:14

WORKDIR /usr/app
COPY package*.json ./
COPY ./resources ./resources
RUN npm install
RUN npm rebuild bcrypt --build-from-source
COPY . .

CMD ["npm", "start"]

