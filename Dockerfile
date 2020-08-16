FROM node:12.16.3-buster

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
RUN npm install
RUN npm install react-scripts@3.4.3 -g
COPY . /app

CMD ["npm", "start"]