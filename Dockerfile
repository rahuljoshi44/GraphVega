FROM node:14-alpine AS build-env

WORKDIR /graphvega
ADD . .
RUN npm ci --only-production

FROM node:14-alpine
COPY --from=build-env /graphvega /graphvega

WORKDIR /graphvega
EXPOSE 3000
EXPOSE 8000
ENTRYPOINT ["npm", "start"]
