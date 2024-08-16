const db = require("../../db/connection");
const seed = require("../../db/seeds/seed");
const data = require("../../db/data");

beforeAll(() => {
  return seed(data);
});

afterAll(() => db.end());

describe("seed", () => {
  describe("users table", () => {
    test("users table exists", () => {
      return db.query(
        `SELECT EXISTS (SELECT FROM
        information_schema.tables
        WHERE
        table_name = 'users';)`
      );
    });
  });
});
