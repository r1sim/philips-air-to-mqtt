FROM node:18 as builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN ls -al
RUN npm run build

FROM node:18

ENV NODE_ENV production
USER node

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY --from=builder /usr/src/app/dist ./dist
CMD ["node", "dist/index.js"]