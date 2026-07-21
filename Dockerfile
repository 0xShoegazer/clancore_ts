# Allow caching of layers to speed up builds
FROM node:23 AS base

FROM base as build

WORKDIR /usr/src/app
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# These do not change much so leverage docker caching with separate copy operation
COPY package*.json ./
# Install app dependencies
RUN npm install
# Bundle app source
COPY . .
# Copy the .env and files
COPY .env ./
# Migrations and things of that nature could be run here
# RUN npm run migrate:deploy
# Creates a "dist" folder with the production build
RUN npm run build


FROM base AS production

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package.json .
COPY --from=build /usr/src/app/package-lock.json .

# # Expose the port on which the app will run
# EXPOSE 3001

# CMD [ "npm", "run", "start:prod" ]