FROM node:20-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm ci 

COPY . .
RUN npm run tsc

CMD ["npm", "run", "start"]
