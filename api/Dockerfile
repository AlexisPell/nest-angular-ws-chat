# DEVELOPMENT
FROM node:14 AS development

WORKDIR /app

COPY package*.json .

COPY yarn.lock .

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 5000

# PRODUCTION
FROM node:14 AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY --from=development /app .

EXPOSE 5000

CMD ["node", "dist/main"]