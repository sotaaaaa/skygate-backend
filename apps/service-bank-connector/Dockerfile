# Build image
FROM node:18.14.0 AS BUILD_IMAGE

# Install dependencies
WORKDIR /server
COPY package.json tsconfig*.json /server/

COPY . .

# Install dependencys
RUN yarn global add @nestjs/cli \
  && yarn install --production=true --pure-lockfile \
  && yarn run build service-bank-connector

# Remove development dependencies
RUN curl -sf https://gobinaries.com/tj/node-prune | sh \
  && node-prune

# Production images
FROM node:18.14.0-alpine
WORKDIR /server

COPY --from=BUILD_IMAGE /server/dist ./dist
COPY --from=BUILD_IMAGE /server/node_modules ./node_modules

# Command
CMD ["node", "dist/apps/service-bank-connector/main.js"]
