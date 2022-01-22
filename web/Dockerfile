FROM node:14 AS development

WORKDIR /app

COPY package*.json .

RUN npm install
RUN npm install @angular/cli@13.1.4 -g

COPY . .

RUN npm run build

EXPOSE 4200

