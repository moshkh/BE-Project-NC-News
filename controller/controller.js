const { selectTopics } = require("../model/model");

exports.getTopics = (req, res, next) => {
  console.log(req.url);
  if (req.url !== "/api/topics") {
    return Promise.reject();
  }
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};
