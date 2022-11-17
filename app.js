const express = require("express");
const {
  getTopics,
  getArticles,
  getArticleById,
  getArticleComments,
  postCommentToArticle,
  getUsers,
} = require("./controller/controller");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getArticleComments);
app.get("/api/users", getUsers);

app.post("/api/articles/:article_id/comments", postCommentToArticle);

//errors

//handling invalid url
app.all("/*", (req, res) => {
  console.log("Logging from app.all() as an invalid URL err");
  res.status(404).send({ msg: "invalid URL" });
});

//handling custom errors
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    const { status, msg } = err;
    console.log(err, "Logging from app as custom err!");
    res.status(status).send({ msg });
  } else {
    next(err);
  }
});

//psql errors
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    console.log(err, "Logging from app as PSQL 22P02 err!");
    res.status(400).send({ msg: "invalid id" });
  }
  if (err.code === "23503") {
    console.log(err, "Logging from app as PSQL 23503 err!");
    res.status(404).send({ msg: "not found" });
  }
  if (err.code === "23502") {
    console.log(err, "Logging from app as PSQL 23502 err!");
    res.status(400).send({ msg: "property missing or invalid" });
  } else {
    next(err);
  }
});

//catch all
app.use((err, req, res, next) => {
  console.log(err, "Logging from app in the catch all!!!");
  res.status(500).send({ msg: "server error!" });
});

module.exports = app;
