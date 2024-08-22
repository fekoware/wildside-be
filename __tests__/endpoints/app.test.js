const request = require("supertest");
const db = require("../../db/connection");
const seed = require("../../db/seeds/seed");
const data = require("../../db/data");
const app = require("../../app");
const Test = require("supertest/lib/test");
const endpoints = require("../../endpoints.json")

beforeEach(() => seed(data));

afterAll(() => db.end());

describe("/api/sightings/user/:user_id", () => {
  describe("GET", () => {
    test("200: Responds with sightings within the specified latitude/longitude range for a given user", () => {
      return request(app)
      .get("/api/sightings/user/1?swlat=-10.0&swlong=30.0&nelat=10.0&nelong=50.0")
      .expect(200)
      .then(({ body }) => {
        body.sightings.forEach((sighting) => {
          expect(sighting.user_id).toBe(1);
          expect(sighting.lat_position).toBeGreaterThanOrEqual(-10.0);
          expect(sighting.lat_position).toBeLessThanOrEqual(10.0);
          expect(sighting.long_position).toBeGreaterThanOrEqual(30.0);
          expect(sighting.long_position).toBeLessThanOrEqual(50.0);
          });
    })
  })
  test("404: Returns No sightings found if no sightings are found within the specified latitude/longitude range", () => {
    return request(app)
      .get("/api/sightings/user/1?swlat=-90.0&swlong=-180.0&nelat=-80.0&nelong=-170.0")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("No sightings found for the given user and coordinates")
      });
  });
  test("400: Responds with a 400 error for invalid latitude/longitude values", () => {
    return request(app)
      .get("/api/sightings/user/1?swlat=-100.0&swlong=30.0&nelat=10.0&nelong=50.0")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Invalid latitude/longitude range");
      });
  });
  })
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
        .post("/api/sightings/user/3")
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
        .post("/api/sightings/user/300")
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
      .post("/api/sightings/user/3")
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
      .post("/api/sightings/user/3")
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
      .post("/api/sightings/user/3")
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
    test("400: Responds with bad request when an email already exists", () => {
      const newUser = {
        username: "katie01",
        password: "Nature123",
        email: "iloveplants@gmail.com",
      };
      return request(app)
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("Email already exists")
        })
    })
    test("400: Responds with bad request when the username and password already exists", () => {
      const newUser = {
        username: "katiep",
        password: "Nature123",
        email: "katiep@gmail.com",
      };
      return request(app)
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("User already exists")
        })
    })
    test("400: Responds with bad request when required fields are missing", () => {
      const newUser = {
        username: "wildlife9",
      };
      return request(app)
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("All fields are required (username, password, email)");
        });
    })
    test("400: Responds with bad request when email format is invalid", () => {
      const newUser = {
        username: "wildlife9",
        password: "Nature123",
        email: "invalid-email-format",
      };
      return request(app)
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("Invalid email format");
        });
    })
    test("400: Responds with bad request when password is too short", () => {
      const newUser = {
        username: "wildlife9",
        password: "123",
        email: "explorethewild@outlook.com",
      };
      return request(app)
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .then(({ body }) => {
          const { message } = body;
          expect(message).toBe("Password must be at least 8 characters long");
        });
  })
})
describe("GET", () => {
  test("200: Responds with a list of all users", () => {
    return request(app)
    .get("/api/users")
    .expect(200)
    .then((response) => {
      expect(response.body.users.length).toBe(5);
      response.body.users.forEach((user) => {
        expect(typeof user.username).toBe("string");
        expect(typeof user.email).toBe("string");
        expect(user).toHaveProperty("user_id");
        expect(user).toHaveProperty("username");
        expect(user).toHaveProperty("email");
      });
    });
  })
  test("404: Responds with path not found for a non-existent endpoint", () => {
    return request(app)
      .get("/api/nonexistent")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("path not found");
      });
  });
  test("200: Users list does not include passwords", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        response.body.users.forEach((user) => {
          expect(user).not.toHaveProperty("password");
        });
      });
  });
  test("200: Responds with the user object when the username exists", () => {
    return request(app)
      .get("/api/users/plantsarelifee")
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toEqual({
          user_id: expect.any(Number),
          username: "plantsarelifee",
          email: "plantsarelifee@gmail.com",
        });
      });
})
test("404: Responds with 'User not found' when the username does not exist", () => {
  return request(app)
    .get("/api/users/nonexistentuser")
    .expect(404)
    .then(({ body }) => {
      expect(body.message).toBe("User not found");
    });
});
})
})

describe("/sighting/:sighting_id", () => {
  describe("GET", () => {
  test("200: Responds with a sighting that corresponds with the sighting id", () => {
    return request(app)
      .get("/api/sightings/1")
      .expect(200)
      .then(({ body }) => {
        const { sighting } = body;
        expect(sighting).toEqual({
          sighting_id: 1,
          user_id: 1,
          uploaded_image: "https://example.com/images/elephant1.jpg",
          sighting_date: expect.any(String),
          long_position: 34.80746,
          lat_position: -1.29207,
          common_name: "African Elephant",
          taxon_name: "Loxodonta africana",
          wikipedia_url: "https://en.wikipedia.org/wiki/African_elephant",
        });
  })
})
test("404: Responds with Sighting not found when sighting_id does not exist", () => {
  return request(app)
    .get("/api/sightings/9999")
    .expect(404)
    .then(({ body }) => {
      expect(body.message).toBe("Sighting not found");
    });
})
test("400: Responds with Invalid sighting id when the sighting_id is invalid", () => {
  return request(app)
    .get("/api/sightings/notanumber")
    .expect(400)
    .then(({ body }) => {
      expect(body.message).toBe("Invalid sighting id");
    });
});
})
})

describe("GET /api", () => {
  test("responds with a json detailing all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});
