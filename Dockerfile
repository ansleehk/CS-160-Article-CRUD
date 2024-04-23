FROM node:20.11.1-slim
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm run prisma-db-pull
RUN npm run prisma-generate

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
