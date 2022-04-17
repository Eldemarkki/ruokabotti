FROM node:17-alpine

WORKDIR /app/src

COPY . .

RUN ln -s /usr/bin/nodejs /usr/bin/node
RUN npm install -g ts-node
RUN npm ci 

CMD ["npm", "run", "deploy:commands"]
