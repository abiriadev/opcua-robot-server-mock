# use alpine for pnpm and other packages
FROM node:18-alpine AS builder
WORKDIR /opc

# install latest pnpm
RUN wget -qO /bin/pnpm "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-linuxstatic-x64" && chmod +x /bin/pnpm

# update system
RUN apk update
RUN apk add openssl

# copy all code at workdir directory
COPY ../../out/full/ .
COPY ../../out/pnpm-lock.yaml pnpm-lock.yaml

# install depdencies
RUN pnpm install

# run the server
CMD ["node", "./dist/index.js"]
