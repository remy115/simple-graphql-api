const { checkAuth } = require("../utils/auth");

// Data Sources
const { TaskAPI, UserAPI } = require("../dataSources");

const createStore = require("../store");

const typeDefs = require("../schemas");
const resolvers = require("../resolvers");

const port = process.env.PORT || 3005;

const env = process.env.NODE_ENV;

const context = async (args) => {
  const { req } = args;
  let auth = false,
    ip = "",
    proto = "",
    useragent = "";
  if (req && req.headers) {
    auth = req.headers.authorization || req.headers.Authorization || false;
    ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    useragent = req.headers["user-agent"];
  }
  const userData = await checkAuth(auth);

  // to test "loading" feature in the front-end
  // if (env !== "production") await sleepFnc(700);

  return {
    user: userData,
    ip,
    useragent,
  };
};

const store = createStore();

const dataSources = () => ({
  task: new TaskAPI({ store }),
  user: new UserAPI({ store }),
});

const formatError =
  env === "production"
    ? (error) => {
        delete error.extensions.exception;
        return error;
      }
    : null;

const playground = env === "production" ? false : true;
// const playground = false;

module.exports = {
  dataSources,
  typeDefs,
  resolvers,
  context,
  formatError,
  playground,
  port,
};
