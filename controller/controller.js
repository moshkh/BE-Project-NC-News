const {
  selectTopics,
  selectArticles,
  selectArticleById,
} = require("../model/model");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  //deconstructing for access to article_id
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      if (err.code === "22P02") {
        //send custom error to next
        next({ status: 400, msg: "invalid id" });
      }
      next(err);
    });
};
