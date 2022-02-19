FROM node:17-alpine

WORKDIR /app/src

COPY . .

RUN npm install -g ts-node
RUN npm ci 

CMD ["npm", "run", "deploy:commands"]