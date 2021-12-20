# Simple Graphql TO-DO server

## Installation


```npm i```


MongoDB is required!

## Test

```npm test```


The MongoDB database used for tests will the current one (given in "MONGO_URI" env var) + "_test".

## Execution 


```npm start```


## Env vars

 - PORT port application will run on
 - MONGO_URI MongoDB URI for connection *mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb]]*



## Improvements

 - improve test cases *(only integration test for "User" entity was added)*;
 - add the "authorization" logic;
 - migrate to Typescript;
 - dockerize the application;
 - create an endpoint to provide the task statuses mapping (key => label);

