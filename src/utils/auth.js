const { ForbiddenError } = require("apollo-server");

const { encryptData, decryptData } = require("./tools");

// authorization management
// through here it's possible to control the access to the tasks
const authorization = ({ context, args, operation, model }) => {
  const publicActions = ["listTasks", "saveTask", "listUsers", "saveUser"];
  // const public = [];

  if (!publicActions.includes(operation) && !context.user) {
    throw new ForbiddenError("Access denied!");
  }

  return true;
};

// User token
const createUserToken = async (user) => {
  const tokenObj = {
    id: user.id,
    name: user.name,
    role: user.role,
    timestamp: Date.now(),
  };

  const token = await encryptData(tokenObj);
  return token.toString("base64");
};

// 1 hour token expiration
const expirationInterval = 60 * 60 * 1000;
const checkAuth = async (auth) => {
  let userData;
  if (auth) {
    try {
      userData = await decryptData(auth);
      userData = JSON.parse(userData.toString());
      const { timestamp = 0 } = userData;
      const now = Date.now();
      if (now - timestamp > expirationInterval) {
        userData = false;
      }
    } catch (e) {
      userData = false;
    }
  }
  return userData;
};

module.exports = { authorization, createUserToken, checkAuth };
