FROM node:20.11.0

WORKDIR /app

COPY . /app

RUN npm i
#Corrige problema de fetchPriority , instalando uma versao instavel, mas funciona.
RUN npm install next@canary --force 

CMD npm run test