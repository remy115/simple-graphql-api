const { DataSource } = require("apollo-datasource");

const { escapeRegExp } = require("../utils/tools");

class UserAPI extends DataSource {
  constructor({ store }) {
    super();
    this.store = store;
  }

  initialize(config) {
    this.context = config.context;
  }

  async createOrUpdate(user) {
    const { id, name, status } = user;

    // console.log("user", user);

    let model;
    if (id) {
      model = await this.store.User.findById(id);
      if (!model) {
        throw new Error(`User ID not found! (ID: ${id})`);
      }
      model.name = name;
      model.status = status;
      model.updatedAt = Date.now();
    } else {
      model = new this.store.User({
        name,
        status,
      });
    }

    const savedUser = await model.save();
    // console.log("saveduser", savedUser, savedUser.toJSON());
    return savedUser.toJSON();
  }

  async list({ query = {}, projection = null } = {}) {
    if (query.id) {
      query._id = query.id;
    }
    delete query.id;

    if (query.name && typeof query.name === "string") {
      query.name = { $in: [query.name, new RegExp(escapeRegExp(query.name), "i")] };
    } else {
      delete query.name;
    }

    const users = await this.store.User.find(query, projection).exec();
    return users;
  }
}

module.exports = UserAPI;
