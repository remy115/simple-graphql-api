const { authorization } = require("../utils/auth");

/**
 * @typedef {import('../models/User/index').UserType} UserType
 */

module.exports = {
  Query: {
    listUsers: async (_, args, context) => {
      const { dataSources } = context;
      await authorization({ context, args, operation: "listUsers" });

      /** @type {{search: UserType}} */
      const { search = {} } = args;
      const users = (await dataSources.user.list({ query: search })) || [];
      return {
        users,
        msg: `${users.length} found!`,
      };
    },
  },

  Mutation: {
    saveUser: async (_, { input }, context) => {
      const { dataSources } = context;
      await authorization({ context, args: input, operation: "saveUser" });

      try {
        const { id, name, status } = input;

        const savingUser = { id, name, status };
        const ret = await dataSources.user.createOrUpdate(savingUser);

        // console.log("user-resolver-mutation", ret);
        return {
          status: "success",
          message: "User saved!",
          user: ret,
        };
      } catch (e) {
        const msg = e.message;
        return {
          status: "error",
          message: msg,
        };
      }
    },
  },

  User: {
    id: (value) => (value && value._id ? value._id : value),
    tasksQtd: async (userModel, _, { dataSources }) => {
      const userId = userModel.id;
      const tasks = await dataSources.task.count({ query: { user: userId } });
      return tasks;
    },
  },
};
