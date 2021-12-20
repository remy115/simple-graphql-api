const { DataSource } = require("apollo-datasource");

const { Counter } = require("../models");

class TaskAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  initialize(config) {
    this.context = config.context;
  }

  async createOrUpdate(task) {
    const { id, user, title, descr, status } = task;
    console.log("task DATASOURCE (createOrUpdate) task arg: ", task);

    let model;
    if (id) {
      model = await this.store.Task.findById(id);
      if (!model) {
        throw new Error(`Task ID not found! (ID: ${id})`);
      }
      console.log("task DATASOURCE (createOrUpdate) model found: ", model);
      model.user = user;
      model.title = title;
      model.descr = descr;
      model.status = status;
      model.updatedAt = Date.now();
    } else {
      const taskCounter = await Counter.findOneAndUpdate(
        {},
        {
          $inc: { task: 1 },
        },
        { new: true, upsert: true }
      );
      // console.log("task DATASOURCE (createOrUpdate)", taskCounter);
      const id = taskCounter.task;
      model = new this.store.Task({
        _id: id,
        user,
        title,
        descr,
        status,
      });
    }
    await model.save();
    const newTaskModel = await this.list({ query: { id: model.id } });
    return newTaskModel[0];
  }

  async list({ query = {}, projection = null } = {}) {
    if (query.id) {
      query._id = query.id;
      delete query.id;
    }

    const tasks = await this.store.Task.find(query, projection).exec();
    return tasks;
  }

  async count({ query }) {
    const qtd = await this.store.Task.count(query);
    return qtd;
  }
}

module.exports = TaskAPI;
