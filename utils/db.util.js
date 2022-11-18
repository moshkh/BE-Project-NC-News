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

exports.topicQuery = (topic) => {
  if (topic) {
    let queryValues = [topic];
    

    queryStr += `WHERE topic = $1`;

    queryStr += ` GROUP BY articles.article_id ORDER BY created_at DESC;`;

  } else {
    let query = (`
    
    GROUP BY articles.article_id
    ORDER BY created_at DESC;
    `);
  }
};
