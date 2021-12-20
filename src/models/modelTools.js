const validatorById = ({ modelName, msg }) => {

  return async function (val) {
    if(!val) {
      throw new Error(msg);
    }
    const found = await this.schema.base.models[modelName].count({
      _id: val
    });
    if (found < 1) {
      throw new Error(msg);
    }
    return true;
  }
}


module.exports = {
  validatorById
}