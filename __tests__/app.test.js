const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index.js");
const endpointJson = require("../endpoints.json");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("/api", () => {
  test("GET: 200 - Responds with the endpoint.json file describing all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointJson);
      });
  });
});

describe("/api/topics", () => {
  test("GET: 200 - Responds with an array of topic objects with slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBeGreaterThan(0);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
});

describe("/api/articles", () => {
  test("GET - 200: Responds with an array of article objects, each object includes username and comment_count - articles are in date descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBeGreaterThan(0);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
          });
        });
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  describe("/api/articles/(queries)", () => {
    describe("?topic", () => {
      test("GET: 200 - querying an existing topic responds with articles on that topic", () => {
        return request(app)
          .get("/api/articles/?topic=mitch")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).toBeGreaterThanOrEqual(1);
            articles.forEach((article) => {
              expect(article).toMatchObject({
                topic: "mitch",
              });
            });
          });
      });
      test("GET: 200 - querying an existing topic with no articles responds with an empty array", () => {
        return request(app)
          .get("/api/articles/?topic=paper")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toEqual([]);
          });
      });
      test("GET: 404 - querying a non-existing topic responds with msg 'not found'", () => {
        return request(app)
          .get("/api/articles/?topic=doesnotexist")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("not found");
          });
      });
    });
    describe("?sort_by", () => {
      test("GET 200: - (Default) responds with articles sorted by created_at in descending order if no sort_by query given", () => {
        return request(app)
          .get("/api/articles/")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("created_at", { descending: true });
            expect(articles.length).toBe(testData.articleData.length);
          });
      });
      test("GET: 200 - responds with articles sorted by article_id in descending order, when specified in query", () => {
        return request(app)
          .get("/api/articles/?sort_by=article_id")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("article_id", { descending: true });
            expect(articles.length).toBe(testData.articleData.length);
          });
      });
      test("GET: 200 - responds with articles sorted by title in descending order, when specified in query", () => {
        return request(app)
          .get("/api/articles/?sort_by=title")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("title", { descending: true });
            expect(articles.length).toBe(testData.articleData.length);
          });
      });
      test("GET: 200 - responds with articles sorted by topic in descending order, when specified in query", () => {
        return request(app)
          .get("/api/articles/?sort_by=topic")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("topic", { descending: true });
            expect(articles.length).toBe(testData.articleData.length);
          });
      });
      test("GET: 200 - responds with articles sorted by author in descending order, when specified in query", () => {
        return request(app)
          .get("/api/articles/?sort_by=author")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("author", { descending: true });
            expect(articles.length).toBe(testData.articleData.length);
          });
      });
      test("GET: 200 - responds with articles sorted by created_at in descending order, when specified in query", () => {
        return request(app)
          .get("/api/articles/?sort_by=created_at")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("created_at", { descending: true });
            expect(articles.length).toBe(testData.articleData.length);
          });
      });
      test("GET: 200 - responds with articles sorted by votes in descending order, when specified in query", () => {
        return request(app)
          .get("/api/articles/?sort_by=votes")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("votes", { descending: true });
            expect(articles.length).toBe(testData.articleData.length);
          });
      });
      test("GET: 400 - if invalid sort_by query responds with msg: 'bad request'", () => {
        return request(app)
          .get("/api/articles/?sort_by=FFFF")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("bad request");
          });
      });
    });
    describe("?order", () => {
      test("GET - 200: (Default) responds with articles in descending order if no order query provided", () => {
        return request(app)
          .get("/api/articles/?sort_by=article_id")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("article_id", { descending: true });
            expect(articles.length).toBe(testData.articleData.length);
          });
      });
      test("GET - 200: responds with articles order in ascending when order query is given ASC", () => {
        return request(app)
          .get("/api/articles/?sort_by=topic&order=ASC")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("topic", { descending: false });
            expect(articles.length).toBe(testData.articleData.length);
          });
      });
      test("GET - 200: responds with articles order in descending when given DESC", () => {
        return request(app)
          .get("/api/articles/?sort_by=votes&order=DESC")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("votes", { descending: true });
            expect(articles.length).toBe(testData.articleData.length);
          });
      });
      test("GET - 200: when given an ASC order query without a sort_by query it responds with articles in created_at ascending order", () => {
        return request(app)
          .get("/api/articles/?order=ASC")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("created_at", { descending: false });
            expect(articles.length).toBe(testData.articleData.length);
          });
      });
      test("GET - 200: when given an DESC order query without a sort_by query it responds with articles in created_at descending order", () => {
        return request(app)
          .get("/api/articles/?order=DESC")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSortedBy("created_at", { descending: true });
            expect(articles.length).toBe(testData.articleData.length);
          });
      });
      test("GET - 400: if invalid order query responds with msg 'bad request'", () => {
        return request(app)
          .get("/api/articles/?order=down")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("bad request");
          });
      });
    });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET: 200 - Responds with single article with the correct article_id", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.article_id).toBe(2);
      });
  });
  test("GET: 200 - The response article to have the correct structure / properties", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.article_id).toBe(3);
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(String),
        });
      });
  });
  test("GET: 404 - If article doesn't exist responds with a msg: 'not found'", () => {
    return request(app)
      .get("/api/articles/100")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("GET: 400 - If article_id is not a number respond with msg: 'invalid id / input'", () => {
    return request(app)
      .get("/api/articles/one")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid id / input");
      });
  });
  test("PATCH: 200 - Increase votes for article successfully and respond with the updated article", () => {
    const newVote = { inc_votes: 10 };
    return request(app)
      .patch("/api/articles/3")
      .send(newVote)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.article_id).toBe(3);
        expect(article.votes).toBe(10);
      });
  });
  test("PATCH: 200 - Decrease votes for article successfully and respond with the updated article", () => {
    const newVote = { inc_votes: -20 };
    return request(app)
      .patch("/api/articles/5")
      .send(newVote)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.article_id).toBe(5);
        expect(article.votes).toBe(-20);
      });
  });
  test("PATCH: 200 - If more properties than inc_votes are on body still update the vote count and respond with updated article", () => {
    const newVote = { inc_votes: -2, article_id: 7 };
    return request(app)
      .patch("/api/articles/7")
      .send(newVote)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.article_id).toBe(7);
        expect(article.votes).toBe(-2);
      });
  });
  test("PATCH: 400 - If post body is incorrectly formatted respond with msg: 'invalid id / input'", () => {
    const newVote = { inc_votes: "one" };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid id / input");
      });
  });
  test("PATCH: 404 - If article_id does not exist respond with msg: 'not found'", () => {
    return request(app)
      .patch("/api/articles/100")
      .send({ inc_votes: 5 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("PATCH: 400 - If article_id is not a number respond with msg: 'invalid id / input'", () => {
    return request(app)
      .patch("/api/articles/fifty")
      .send({ inc_votes: 150 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid id / input");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("GET: 200 - responds with comments for a given article_id, comments response to be in the correct structure", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        console.log(comments);
        expect(Array.isArray(comments)).toBe(true);
        expect(comments.length).toBe(2);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          });
          expect(comments).toBeSortedBy("created_at", {
            descending: true,
          });
        });
      });
  });
  test("GET: 200 - Responds with an empty comment array when given an article_id which has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        console.log(comments);
        expect(Array.isArray(comments)).toBe(true);
        expect(comments.length).toBe(0);
      });
  });
  test("GET: 404 - If article doesn't exist responds with a msg: 'not found'", () => {
    return request(app)
      .get("/api/articles/100/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("GET: 400 - If article_id is not a number respond with msg: 'invalid id / input'", () => {
    return request(app)
      .get("/api/articles/one/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid id / input");
      });
  });
  test("POST: 201 - Object in the post is successfully added to the db and a response is made back container the posted comment", () => {
    const newComment = { username: "butter_bridge", body: "test comment" };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: expect.any(Number),
          body: expect.any(String),
          article_id: 2,
          author: expect.any(String),
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  test("POST: 201 - If post has any other properties apart from username or body responds, ignore extra properties and proceed with post", () => {
    const newComment = {
      username: "butter_bridge",
      body: "test comment",
      article: 1,
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: expect.any(Number),
          body: expect.any(String),
          article_id: 2,
          author: expect.any(String),
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  test("POST: 400 - If post body is incorrectly formatted e.g. no username or body contents responds with msg: 'bad request'", () => {
    const newComment = { username: "", body: "" };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("POST: 400 - If post body does not have a username responds with msg 'property missing or invalid'", () => {
    const newComment = { body: "test" };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("property missing or invalid");
      });
  });
  test("POST: 400 - If post body does not have a body responds with msg 'propery missing or invalid'", () => {
    const newComment = { username: "butter_bridge" };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("property missing or invalid");
        ``;
      });
  });
  test("POST: 400 - If username does not exist responds with msg : 'property missing or invalid'", () => {
    const newComment = { body: "test" };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("property missing or invalid");
      });
  });
  test("POST: 404 - If article_id does not exist respond with msg: 'not found'", () => {
    const newComment = { username: "butter_bridge", body: "test comment" };
    return request(app)
      .post("/api/articles/100/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("POST: 400 - If article_id is not a number respond with msg: 'invalid id / input'", () => {
    const newComment = { username: "butter_bridge", body: "test comment" };
    return request(app)
      .post("/api/articles/one/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid id / input");
      });
  });
});

describe("/api/users", () => {
  test("GET: 200 - responds with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users.length).toBeGreaterThan(0);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("DELETE: 204 - comment with the comment_id provided in the URL is deleted and responds with no content", () => {
    return request(app)
      .delete("/api/comments/16")
      .expect(204)
      .then(({ body }) => {
        console.log(body);
        expect(body).toMatchObject({});
      })
      .then(() => {
        //comment 16 is for article 6 - article 6 only has one comment
        //running a test after the delete to ensure article 6 has no comments
        return request(app)
          .get("/api/articles/6/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            console.log(comments);
            expect(Array.isArray(comments)).toBe(true);
            expect(comments.length).toBe(0);
          });
      });
  });
  test("DELETE: 204 - if comment id does not exist it responds with an err msg: 'comment not found'", () => {
    return request(app)
      .delete("/api/comments/100")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("comment not found");
      });
  });
});

describe("General Errors", () => {
  test("GET: 404 - Nonexistent API path returns error message 'invalid url'", () => {
    return request(app)
      .get("/api/topcs")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("invalid URL");
      });
  });
});
