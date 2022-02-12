# npm run build must go before copy . ./app
# it handles node_modules as well
# so no need to include them in volumes
FROM node:14 AS development

WORKDIR /app

COPY package*.json .

RUN npm install
RUN npm install @angular/cli@13.1.4 -g
RUN npm run build

COPY . ./app

EXPOSE 4200 49153
