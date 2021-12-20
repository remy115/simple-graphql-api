const mongoose = require("mongoose");
const { validatorById } = require("../modelTools");
const { taskStatus } = require("../../config/task");

const Id = mongoose.Types.ObjectId;

/**
 * @typedef {import('../../config/task').taskStatusType} taskStatusType
 *
 * Task Model
 * @typedef {Object} TaskType
 * @property {string} user - user Mongo ID for the User Model
 * @property {string} title - task's title
 * @property {string} descr - task's description
 * @property {taskStatusType} status - task's status
 * @property {Date} createdAt - task's created at
 * @property {Date} updatedAt - task's updated at
 */

const taskSchema = new mongoose.Schema({
  _id: { type: Number },
  user: { type: Id, required: true, validate: { validator: validatorById({ modelName: "user", msg: "User not found!" }) } },
  title: { type: String },
  descr: { type: String },
  status: {
    type: String,
    validate: {
      validator: function (val) {
        if (!taskStatus.hasOwnProperty(val)) {
          throw new Error(`Invalid status given! (Valid statuses: ${Object.getOwnPropertyNames(taskStatus).join(" | ")})`);
        }
        return true;
      },
    },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("task", taskSchema);
