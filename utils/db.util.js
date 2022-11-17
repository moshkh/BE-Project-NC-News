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
      console.log(rows, "logging from util");
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
