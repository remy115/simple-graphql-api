const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const NODE_ENV = process.env.NODE_ENV;

const MONGO_DB_TEST = NODE_ENV === "test" ? "_test" : "";

const url = process.env.MONGO_URI ? process.env.MONGO_URI + MONGO_DB_TEST : "mongodb://localhost/graphql_server" + MONGO_DB_TEST;

console.log(url);

module.exports = mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });

mongoose.Error.messages.general.required = "'{PATH}' is required!";
