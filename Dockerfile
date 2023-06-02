FROM node:18 as builder

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine
USER root 

# Install py-air-control (used by philips-air package)
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 py3-pip && ln -sf python3 /usr/bin/python
RUN pip3 install py-air-control

# Create app directory
USER node
WORKDIR /usr/src/app

# Install app dependencies
ENV NODE_ENV production
COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY --from=builder /usr/src/app/dist ./dist
CMD ["node", "dist/index.js"]