FROM node:14.15.0

COPY src src
COPY package.json package.json
RUN mkdir ssl

RUN npm install

EXPOSE 3000/tcp

ENTRYPOINT ["node", "src/index.js"]
