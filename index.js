require("dotenv").config();
const { ApolloServer, ForbiddenError } = require("apollo-server-express");
const express = require("express");

const { dataSources, typeDefs, resolvers, context, formatError, playground, port } = require("./src/config/apollo");

const app = express();

// const sleepFnc = (tm) => {
//   return new Promise((res, rej) => {
//     return setTimeout(() => {
//       return res(tm);
//     }, tm);
//   });
// };

const server = new ApolloServer({
  dataSources,
  typeDefs,
  resolvers,
  context,
  formatError,
  playground,
  debug: false,
});

// app.use('/api',server);

server.start().then(() => {
  server.applyMiddleware({
    app: app,
    path: "/api",
  });
});

// const authedRoute = async (req,res,next)=>{
//   const auth=req.get('authorization');
//   const userData = await checkAuth(auth);
//   if(userData) {
//     return next();
//   }
//   return res.status(401).json({error:'Authentication required!'});
// }

app.listen(port, () => console.log(`Running as SERVER - ${port}`));
