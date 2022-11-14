const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index.js");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("/api/topics", () => {
  test("GET - 200: Responds with an array of topic objects with slug and description properties", () => {
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

describe("General Errors", () => {
  test("GET - 404: Nonexistent API path returns error message 'invalid url'", () => {
    return request(app)
      .get("/api/topcs")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("invalid URL");
      });
  });
});
