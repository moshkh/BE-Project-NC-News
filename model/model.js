const db = require("../db/connection");
const {
  checkArticleExists,
  currentVotesForArticle,
  topicQuery,
  checkTopicExists,
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

exports.selectArticles = (topic, sort_by = "created_at", order = "DESC") => {
  const validSorts = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "comment_count",
  ];
  const validOrders = ["ASC", "DESC"];
  if (!validSorts.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  } else if (!validOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  } else {
    return checkTopicExists(topic).then(() => {
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

      queryStr += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`;

      return db.query(queryStr, queryValues).then(({ rows }) => {
        return rows;
      });
    });
  }
};

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `
      SELECT articles.*, COUNT(comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments
      ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.article_id
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

exports.deleteComment = (comment_id) => {
  return db
    .query(
      `
      DELETE FROM comments
      WHERE comment_id = $1;
      `,
      [comment_id]
    )
    .then(({ rowCount }) => {
      if (!rowCount) {
        return Promise.reject({ status: 404, msg: "comment not found" });
      }
    });
};
