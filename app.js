const express = require("express");
const {
  getTopics,
  getArticles,
  getArticleById,
  getArticleComments,
} = require("./controller/controller");
const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getArticleComments);

//errors

//handling invalid url
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "invalid URL" });
});

//handling custom errors
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    const { status, msg } = err;
    res.status(status).send({ msg });
  } else {
    next(err);
  }
});

//psql errors
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    //send custom error to next
    res.status(400).send({ msg: "invalid id" });
  } else {
    next(err);
  }
});

//catch all
app.use((err, req, res, next) => {
  console.log(err, "caught in the catch all!!!");
  res.status(500).send({ msg: "server error!" });
});

module.exports = app;
