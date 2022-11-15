exports.checkIfValidId = (id) => {
  if (isNaN(id)) {
    return Promise.reject({ status: 400, msg: "invalid id" });
  }
  return Promise.resolve();
};
