# ChatBud
A chat application with backend API written in node js with 

## Application Description
The Application uses NodeJs Express and MongoDb to create a restful service for different application usage 
whereas socketIo enables bidirectional communication in the application for the chat functionality


## To run This application via Docker

You can run 
```
docker-compose up -d 
```

If you want to use mongodb atlas uri
- Remove mongo-db service from docker compose yml 
- Add Atlas Url in the environment section in chatbud service
- Remove depends on
```
version: '3.8'

services:
  chatbud:
    build: .
    ports:
      - 3000:3000 
    environment:
      MONGO_URL: ## Atlas Url here
      PORT: 3000

```




