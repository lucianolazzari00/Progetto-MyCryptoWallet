FROM node:latest

WORKDIR /usr/src/app

VOLUME [ "/usr/src/app" ]

RUN npm install -g nodemon
#RUN chmod +x wait-for-it.sh



