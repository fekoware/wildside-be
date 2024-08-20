const request = require("supertest");
const db = require("../../db/connection");
const seed = require("../../db/seeds/seed");
const data = require("../../db/data");
const app = require("../../app");
const Test = require("supertest/lib/test");

beforeEach(() => seed(data));

afterAll(() => db.end());

describe("/api/sightings/:user_id", () => {
  describe("POST", () => {
    test("201: Adds a sighting by user", () => {
      const newSighting = {
        uploaded_image: "https://example.com/images/petal2.jpg",
        long_position: 44.89763,
        lat_position: -11.15632,
        common_name: "Rose Petal",
        taxon_name: "Roseus Thorneus",
        wikipedia_url: "https://en.wikipedia.org/wiki/RosePetal",
      };
      return request(app)
        .post("/api/sightings/3")
        .send(newSighting)
        .expect(201)
        .then(({ body }) => {
          const { newSighting } = body;

          expect(Object.keys(newSighting)).toHaveLength(9);

          expect(newSighting.sighting_id).toBe(6);
          expect(newSighting.user_id).toBe(3);
          expect(newSighting.uploaded_image).toBe(
            "https://example.com/images/petal2.jpg"
          );
          expect(new Date(newSighting.sighting_date).getTime()).toBeCloseTo(
            Date.now(),
            -5
          );
          expect(newSighting.long_position).toBe(44.89763);
          expect(newSighting.lat_position).toBe(-11.15632);
          expect(newSighting.common_name).toBe("Rose Petal");
          expect(newSighting.taxon_name).toBe("Roseus Thorneus");
          expect(newSighting.wikipedia_url).toBe(
            "https://en.wikipedia.org/wiki/RosePetal"
          );
        });
    });
    test("404: Responds with user not found when receives a user id that does not exist in the database", () => {
      const newSighting = {
        uploaded_image: "https://example.com/images/petal2.jpg",
        long_position: 44.89763,
        lat_position: -11.15632,
        common_name: "Rose Petal",
        taxon_name: "Roseus Thorneus",
        wikipedia_url: "https://en.wikipedia.org/wiki/RosePetal",
      };
      return request(app)
        .post("/api/sightings/300")
        .send(newSighting)
        .expect(404)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("User not found")
        })
    })
  })
  test("400: Responds with Bad Request when received a new sighting with incorrect keys", () => {
    const newSighting = {
      uploaded_img: "https://example.com/images/petal2.jpg",
      long_position: 44.89763,
      common_name: "Rose Petal",
      taxon_name: "Roseus Thorneus",
      wikipedia_url: "https://en.wikipedia.org/wiki/RosePetal",
    };
    return request(app)
      .post("/api/sightings/3")
      .send(newSighting)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad request")
      })
  })
  test("400: Responds with Bad Request when received a new sighting with incorrect value data types", () => {
    const newSighting = {
      uploaded_image: "https://example.com/images/petal2.jpg",
      long_position: "44.89763",
      lat_position: -11.15632,
      common_name: ["rose", "daisy", "flower"],
      taxon_name: "Roseus Thorneus",
      wikipedia_url: "https://en.wikipedia.org/wiki/RosePetal",
    };
    return request(app)
      .post("/api/sightings/3")
      .send(newSighting)
      .expect(400)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Bad request")
      })
  })
  test("416: Responds with Range Error when the longitude and latitude values are invalid", () => {
    const newSighting = {
      uploaded_image: "https://example.com/images/petal2.jpg",
      long_position: 200,
      lat_position: -100,
      common_name: "Rose",
      taxon_name: "Roseus Thorneus",
      wikipedia_url: "https://en.wikipedia.org/wiki/RosePetal",
    };
    return request(app)
      .post("/api/sightings/3")
      .send(newSighting)
      .expect(416)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Range error of latitude (-90, +90) or longitude (-180, 180)")
      })
  })
});

describe("/api/users", () => {
  describe("POST", () => {
    test("201: Adds a user to the database", () => {
      const newUser = {
        username: "wildlife9",
        password: "Nature123",
        email: "explorethewild@outlook.com",
      };
      return request(app)
        .post("/api/users")
        .send(newUser)
        .expect(201)
        .then(({ body }) => {
          const { user } = body;
          expect(Object.keys(user)).toHaveLength(3);
          expect(user.username).toBe("wildlife9");
          expect(user.email).toBe("explorethewild@outlook.com");
        });
    })
    test("400: Responds with bad request when a username already exists", () => {
      const newUser = {
        username: "plantsarelifee",
        password: "Nature123",
        email: "explorethewild@outlook.com",
      };
      return request(app)
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("Username already exists")
        })
    })
  })
})