const db = require("../db/connection");

exports.selectTopics = () => {
  return db
    .query(
      `
        SELECT * FROM topics;
    `
    )
    .then((response) => {
      return response.rows;
    });
};

exports.selectArticles = () => {
  return db
    .query(
      `
    SELECT articles.*, COUNT(comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY created_at DESC;
    `
    )
    .then(({ rows }) => {
      return rows;
    });
};
