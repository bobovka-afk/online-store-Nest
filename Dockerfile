FROM node:20.17.0

WORKDIR /app

RUN apt-get update && apt-get install -y wait-for-it

COPY package*.json ./

RUN npm install

COPY . .

RUN if [ -f tsconfig.json ]; then npm run build; fi

CMD ["npm", "start"]
