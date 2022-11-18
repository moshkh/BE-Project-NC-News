const db = require("../db/connection");
const format = require("pg-format");

exports.checkArticleExists = (article_id) => {
  return db
    .query(
      `
        SELECT * 
        FROM articles
        WHERE article_id = $1
        `,
      [article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
    });
};

exports.commentFormatForInsert = (article_id, username, body) => {
  const nestedArrOfValues = [[article_id, username, body]];

  const itemsInsertStr = format(
    `
  INSERT INTO comments 
  (article_id, author, body) 
  VALUES 
  %L
  RETURNING *;
  `,
    nestedArrOfValues
  );

  return itemsInsertStr;
};

exports.currentVotesForArticle = (article_id) => {
  return db.query(
    `
    SELECT votes FROM articles
    WHERE article_id = $1
    `,
    [article_id]
  );
};

exports.checkTopicExists = (topic) => {
  if (topic) {
    return db
      .query(
        `SELECT * FROM topics
      WHERE slug = $1`,
        [topic]
      )
      .then(({ rows }) => {
        //console.log(rows);
        if (rows.length === 0) {
          return Promise.reject({ status: 404, msg: "not found" });
        }
      });
  } else {
    return Promise.resolve();
  }
};
