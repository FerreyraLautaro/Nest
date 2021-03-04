FROM node:lts-alpine AS dependencies

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# If you are building your code for production
RUN npm i --only=production


FROM node:lts-alpine

WORKDIR /usr/src/app

# Bundle app source
COPY . .
COPY  --from=dependencies /usr/src/app/node_modules ./node_modules

# Publish port
EXPOSE 4000

RUN npm run link
# Server nodejs command and parameters
CMD [ "node", "app.js" ]