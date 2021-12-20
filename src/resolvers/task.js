const { authorization } = require("../utils/auth");

/**
 * @typedef {import('../models/Task/index').TaskType} TaskType
 */

module.exports = {
  Query: {
    listTasks: async (_, args, context) => {
      const { dataSources } = context;
      await authorization({ context, args, operation: "listTasks" });

      /** @type {{search: TaskType}} */
      const { search = {} } = args;

      const tasks = await dataSources.task.list({ query: search });
      return {
        tasks,
        msg: `${tasks.length} found!`,
      };
    },
  },

  Mutation: {
    saveTask: async (_, { input }, context) => {
      const { dataSources } = context;

      await authorization({ context, args: input, operation: "saveTask" });

      const { id, user, title, descr, status } = input;

      const savingTask = { id, user, title, descr, status };
      const ret = await dataSources.task.createOrUpdate(savingTask);

      console.log("task mutation OUTCOME &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&", ret);
      return {
        status: "success",
        message: "Task saved!",
        task: ret,
      };
    },
  },

  Task: {
    id: (value) => (value && value._id ? value._id : value),
    user: async (taskModel, _, { dataSources }) => {
      const userId = taskModel.user;
      const user = await dataSources.user.list({ query: { id: userId } });
      return user[0];
    },
  },
};
