/**
 * @typedef {Object} taskStatusType
 * @property {string} TO_DO -   TO_DO status
 * @property {string} IN_PROGRESS -   IN_PROGRESS status
 * @property {string} DONE -   DONE status
 * @property {string} ARCHIVED -   ARCHIVED status
 */
const taskStatus = {
  TO_DO: "To do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
  ARCHIVED: "Archived",
};

module.exports = {
  taskStatus,
};
