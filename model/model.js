const db = require("../db/connection");
const {
  checkArticleExists,
  currentVotesForArticle,
  topicQuery,
} = require("../utils/db.util");

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

exports.selectArticles = (topic) => {
  let queryValues = [];
  let queryStr = `
      SELECT articles.*, COUNT(comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments
      ON articles.article_id = comments.article_id
      `;

  if (topic) {
    queryValues.push(topic);
    queryStr += `WHERE topic = $1`;
  }

  queryStr += ` GROUP BY articles.article_id ORDER BY created_at DESC;`;

  return db.query(queryStr, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `
    SELECT * FROM articles
    WHERE article_id = $1;
    `,
      [article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return rows[0];
    });
};

exports.selectCommentsByArticleId = (article_id) => {
  return checkArticleExists(article_id)
    .then(() => {
      return db.query(
        `
      SELECT comment_id, votes, created_at, author, body FROM comments
      WHERE article_id = $1
      ORDER BY created_at DESC;
      `,
        [article_id]
      );
    })
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertCommentToArticle = (article_id, username, body) => {
  if (username === "" || body === "") {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  return db
    .query(
      `
      INSERT INTO comments
      (article_id, author, body)
      VALUES
      ($1, $2, $3)
      RETURNING *;
      `,
      [article_id, username, body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.insertVoteForArticle = (article_id, inc_votes) => {
  return checkArticleExists(article_id)
    .then(() => {
      return db.query(
        `
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;
      `,
        [inc_votes, article_id]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.selectUsers = () => {
  return db
    .query(
      `
    SELECT * FROM users;
    `
    )
    .then(({ rows }) => {
      return rows;
    });
};
