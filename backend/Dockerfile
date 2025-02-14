FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080
EXPOSE 8081
EXPOSE 8082
EXPOSE 8083

CMD ["npm", "run", "build"]
CMD ["npm", "start"]