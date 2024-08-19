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
        table_name = 'users')`
      )
        .then(({ rows: [{ exists }] }) => {
          expect(exists).toBe(true);
        })
    })
  });
  test("users table has a unique primary key", () => {
    return db.query(
      `SELECT column_name, data_type, column_default
        FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name = 'user_id';`
    )
      .then(({ rows: [column] }) => {
        expect(column.column_name).toBe("user_id");
        expect(column.data_type).toBe("integer");
        expect(column.column_default).toBe(
          "nextval('users_user_id_seq'::regclass)"
        );
      });
  })
  test("users table has correct columns and test data", () => {
    return db.query(
      `SELECT * FROM users`
    )
      .then(({ rows: users }) => {
        expect(users).toHaveLength(5);
        users.forEach((user) => {
          expect(user).toHaveProperty("user_id");
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("password");
          expect(user).toHaveProperty("email");
        });
      })
  })
  describe("sightings table", () => {
    test("sightings table exists", () => {
      return db.query(
        `SELECT EXISTS (SELECT FROM
        information_schema.tables
        WHERE
        table_name = 'sightings')`
      )
        .then(({ rows: [{ exists }] }) => {
          expect(exists).toBe(true);
        })
    })
    test("sightings table has a unique primary key", () => {
      return db.query(
        `SELECT column_name, data_type, column_default
        FROM information_schema.columns
        WHERE table_name = 'sightings'
        AND column_name = 'sighting_id';`
      )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("sighting_id");
          expect(column.data_type).toBe("integer");
          expect(column.column_default).toBe(
            "nextval('sightings_sighting_id_seq'::regclass)"
          );
        });
    })
    test("sightings table has correct columns and test data", () => {
      return db.query(
        `SELECT * FROM sightings`
      )
        .then(({ rows: sightings }) => {
          expect(sightings).toHaveLength(5);
          sightings.forEach((sighting) => {
            expect(sighting).toHaveProperty("sighting_id");
            expect(sighting).toHaveProperty("user_id");
            expect(sighting).toHaveProperty("uploaded_image");
            expect(sighting).toHaveProperty("sighting_date");
            expect(sighting).toHaveProperty("long_position");
            expect(sighting).toHaveProperty("lat_position");
            expect(sighting).toHaveProperty("common_name");
            expect(sighting).toHaveProperty("taxon_name");
            expect(sighting).toHaveProperty("wikipedia_url");
          });
        })
    })
  });
  describe("my favourite wildlife table", () => {
    test("my favourite wildlife table exists", () => {
      return db.query(
        `SELECT EXISTS (SELECT FROM
          information_schema.tables
          WHERE
          table_name = 'x_favourite_wildlife')`)
        .then(({ rows: [{ exists }] }) => {
          expect(exists).toBe(true);
        })
    })

    test("x_favourite_wildlife table has a unique primary key", () => {
      return db.query(
        `SELECT column_name, data_type, column_default
              FROM information_schema.columns
              WHERE table_name = 'x_favourite_wildlife'
              AND column_name = 'unique_id';`
      )
        .then(({ rows: [column] }) => {
          expect(column.column_name).toBe("unique_id");
          expect(column.data_type).toBe("integer");
          expect(column.column_default).toBe(
            "nextval('x_favourite_wildlife_unique_id_seq'::regclass)"
          );
        });
    })
    test("x_favourite_wildlife table has correct columns and test data", () => {
      return db.query(
        `SELECT * FROM x_favourite_wildlife`
      )
        .then(({ rows: x_favourite_wildlife }) => {
          expect(x_favourite_wildlife).toHaveLength(6);
          x_favourite_wildlife.forEach((column) => {
            expect(column).toHaveProperty("unique_id");
            expect(column).toHaveProperty("sighting_id");
            expect(column).toHaveProperty("user_id");
          });
        })
    })
  })
})