FROM node

WORKDIR /code

COPY package*.json ./

RUN npm install

EXPOSE ${PORT}

COPY . ./

CMD ["node", "server.js"]
