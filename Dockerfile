FROM node:14.15.4-alpine3.10

COPY ./ /app

RUN cd /app && npm install && npm install --save form-data && npm run build

EXPOSE 30001

WORKDIR /app/

CMD ["npm", "run", "start"]
