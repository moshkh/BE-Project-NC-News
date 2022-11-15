const db = require("../db/connection");
const { checkIfValidId } = require("../utils/general.util");

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

exports.selectArticleById = (article_id) => {
  return checkIfValidId(article_id)
    .then(() => {
      return db.query(
        `
    SELECT * FROM articles
    WHERE article_id = $1;
    `,
        [article_id]
      );
    })
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return rows[0];
    });
};
