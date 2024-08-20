const request = require("supertest");
const db = require("../../db/connection");
const seed = require("../../db/seeds/seed");
const data = require("../../db/data");
const app = require("../../app");

beforeEach(() => seed(data));

afterAll(() => db.end());

describe("/api/sightings/:user_id", () => {
  describe("POST", () => {
    test("204: Adds a sighting by user", () => {
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
  });
});
