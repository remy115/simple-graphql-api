require("../config/database");

const { User, Task } = require("../models");

module.exports = () => {
  return {
    User,
    Task,
  };
};
