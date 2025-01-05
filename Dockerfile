# alpine is a lightweight linux distribution
ARG IMAGE=node:20-alpine
FROM $IMAGE as build

WORKDIR /build

COPY package.json .

RUN npm i

COPY . .

RUN npm run build && \
    npm i --omit=dev --ignore-scripts

# application environment
FROM $IMAGE

WORKDIR /project

COPY --from=build build /project

CMD ["node", "dist/server.js"]