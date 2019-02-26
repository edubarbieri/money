FROM node:lts-jessie-slim
LABEL maintainer="Eduardo Barbieri <duduardo23@gmail.com>"


RUN apt-get update && apt-get install g++ make python -y

#Global dependencies
RUN npm install pm2 -g

# Bundle APP files
COPY src src/
COPY package.json .
COPY pm2.json .

# Install app dependencies
ENV NPM_CONFIG_LOGLEVEL warn
ENV npm_config_unsafe_perm true
RUN npm install --production

#Clean build packages
#RUN apt-get remove --purge g++ make python -y && apt-get autoremove -y && apt-get clean

#Server port
EXPOSE 3003

CMD [ "pm2-runtime", "start", "pm2.json", "--env", "production" ]

