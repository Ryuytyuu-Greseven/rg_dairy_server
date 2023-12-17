FROM node:18-alpine

WORKDIR /app

COPY ["package.json","pnpm-lock.yaml", "tsconfig.json","./"]

RUN npm install -g pnpm

RUN pnpm install 

COPY "src" "/app/src"
# COPY ["dist", "./dist"]
COPY [".env","./.env"]

RUN pnpm run build

# CMD ls

CMD pnpm run prod

EXPOSE 1999