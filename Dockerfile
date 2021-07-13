FROM node

ENV PORT 3000
ENV NODE_ENV prod

WORKDIR /app

COPY . /app

RUN npm install

EXPOSE 3000

CMD [ "node", "src/server" ]
