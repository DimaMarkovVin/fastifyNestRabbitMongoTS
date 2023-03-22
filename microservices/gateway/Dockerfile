FROM node:19-alpine AS install-dependencies

WORKDIR /user/src/app

RUN npm install -g npm@9.5.0

COPY package.json package-lock.json ./

RUN npm ci --silent

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start" ]
