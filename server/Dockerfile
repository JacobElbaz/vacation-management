FROM node:lts-alpine3.21

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4000

CMD ["sh", "-c", "npm run dev & sleep 5 && npx ts-node src/seed.ts"]