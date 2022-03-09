FROM node:14.15.0

COPY . .

RUN npm install

EXPOSE 3000/tcp

ENTRYPOINT ["node", "src/index.js"]
