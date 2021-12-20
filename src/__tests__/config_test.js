require("dotenv").config();
const mongoose = require("mongoose");
const { ApolloServer, ForbiddenError } = require("apollo-server-express");
const { dataSources, typeDefs, resolvers, context, formatError, playground, port } = require("../config/apollo");

const testServer = new ApolloServer({
  dataSources,
  typeDefs,
  resolvers,
  context,
  formatError,
  playground,
  debug: false,
});

const closeServices = async () => {
  await testServer.stop();
  await mongoose.connection.close();
};

module.exports = {
  testServer,
  closeServices,
};
