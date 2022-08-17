FROM node:16-alpine

WORKDIR /usr/app/

COPY package*.json .
RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 4000

CMD [ "npm", "run", "dev" ]
