const express = require("express");
const { getTopics, getArticles } = require("./controller/controller");
const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);

//errors

//invalid url
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "invalid URL" });
});

module.exports = app;
