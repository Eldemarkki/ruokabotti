FROM node:17-alpine

WORKDIR /app/src

COPY . .

RUN npm install -g ts-node
RUN npm ci 
RUN npm run deploy:commands

CMD ["npm", "start"]