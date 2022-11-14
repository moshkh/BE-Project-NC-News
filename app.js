const express = require("express");
const { getTopics } = require("./controller/controller");
const app = express();

app.get("/api/topics", getTopics);

//errors

//invalid url
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "invalid URL" });
});

module.exports = app;
