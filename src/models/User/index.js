const mongoose = require("mongoose");
const { userStatus } = require("./userConf");

/**
 * @typedef {import('./userConf').userStatusType} userStatusType
 *
 * @typedef {Object} UserType
 * @property {string} name - User name
 * @property {userStatusType} status - User status
 * @property {Date} createdAt - User create at time
 */

const userSchema = new mongoose.Schema({
  name: { type: String },
  status: {
    type: String,
    validate: {
      validator: function (val) {
        if (!userStatus.includes(val)) {
          throw new Error(`Invalid user status given! (accepted statuses: ${userStatus.join(" | ")})`);
        }
        return true;
      },
    },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("user", userSchema);
