# mutualFriendsFinder

Find mutual friend algo

Following steps are necessary to get your application up and running.

## What is this repository for?

    Chatapp interface.

    Version:- 1.0
    Git clone :-https://github.com/debrajpaul/mutualFriendsFinder.git

## How do I get set up?

    Set up all dependencies mentioned below
    Summary of set up:- Clone the file from repository and follow the "deployment instructions".

## Server Configuration:-

    Node 10 software (Ubuntu 18.04, Link:- https://nodejs.org/en/)
    MongoDB Server version: 4 (Ubuntu 18.04, link:- https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)

## Dependencies

    All dependencies are listed in package.json file
    * In terminal go to your project directory
    * In terminal type "npm i" to add all dependencies.

## .env file

```
PORT=7021
DEBUG=app,app:*
PROTOCOL=http

# mongo credential
MONGO_HOST=127.0.0.1
MONGO_PORT=27017
MONGO_DB=mutualFriendService
MONGO_USERNAME=
MONGO_PASSWORD=

# Unique key to store into the DB
KEY=5dad3e3b2b570f1c40a91ec6

# Twitter credential
CONSUMER_KEY=******************
CONSUMER_SECRET=**************************************
```

## test curl

```
curl -X POST \
  http://localhost:7021/interest-graph-service/twitter-crawler \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 6ab6666a-473e-4e1b-a5a6-8f4f712143a9' \
  -H 'cache-control: no-cache' \
  -d '{
	"authToken": ["1070020496094195712-2Iaor2P26zDSqd3JyPGBgYVmZfs7Gk","1070020496094195712-2Iaor2P26zDSqd3JyPGBgYVmZfs7Gk"],
	"authTokenSecret": ["yS37D7pWzWKe5gkOIq629V2AkUudPuoA3Ys0i6q9fbKGT","yS37D7pWzWKe5gkOIq629V2AkUudPuoA3Ys0i6q9fbKGT"]
}'
```

## Deployment instructions:-

    In terminal go to your project directory
    * Type "npm run watch"
    * Import the postman link:- https://www.getpostman.com/collections/4dcef3852aca81c9633e

## Who do I talk to?

    Debraj Paul
    contact info:- pauldebraj7@gmail.com
    LinkedIn:- https://www.linkedin.com/in/debraj-paul

## License

        Apache License
