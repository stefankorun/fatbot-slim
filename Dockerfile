FROM node:18-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

RUN npm ci --production --silent && mv node_modules ../

COPY . .

RUN npm run build

RUN chown -R node /usr/src/app

USER node

CMD ["npm", "start"]
