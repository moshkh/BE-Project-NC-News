const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed.js;
});

afterAll(() => {
  return db.end();
});
