const { checkValidNewSighting, checkUserExists } = require("../../utils")
const db = require("../../db/connection")

afterAll(() => db.end());

describe("Check valid new sighting", () => {
    test("Returns a boolean", () => {
        const input = {
            uploaded_image: "https://example.com/images/petal2.jpg"
        };
        const output = checkValidNewSighting(input)
        expect(typeof output).toBe("boolean")
    })
    test("Returns false when the new sighting is an empty object", () => {
        const output = checkValidNewSighting({})
        expect(output).toBe(false)
    })
    test("Returns false when the new sighting doesn't have the correct keys", () => {
        const input = {
            uploaded_img: "https://example.com/images/petal2.jpg",
            user_id: "2",
            long_position: 44.89763,
            lat_position: 44.89763,
            common_name: "Rose Petal",
            taxon_name: "Roseus Thorneus",
            wikipedia_url: "https://en.wikipedia.org/wiki/RosePetal",
          };
        const output = checkValidNewSighting(input)
        expect(output).toBe(false)
    })
    test("Returns false when the new sighting object is missing a key", () => {
        const input = {
            long_position: 44.89763,
            user_id: "2",
            lat_position: 44.89763,
            common_name: "Rose Petal",
            taxon_name: "Roseus Thorneus",
            wikipedia_url: "https://en.wikipedia.org/wiki/RosePetal",
          };
        const output = checkValidNewSighting(input)
        expect(output).toBe(false)
    })
    test("Returns false when the new sighting object has additional keys", () => {
        const input = {
            uploaded_image: "https://example.com/images/petal2.jpg",
            user_id: "2",
            long_position: 44.89763,
            lat_position: -11.15632,
            common_name: "Rose Petal",
            taxon_name: "Roseus Thorneus",
            wikipedia_url: "https://en.wikipedia.org/wiki/RosePetal",
            hello: "world"
          };
        const output = checkValidNewSighting(input)
        expect(output).toBe(false)
    })
    test("Returns true when the new sighting object has the correct number of valid keys", () => {
        const input = {
            uploaded_image: "https://example.com/images/petal2.jpg",
            user_id: "2",
            long_position: 44.89763,
            lat_position: -11.15632,
            common_name: "Rose Petal",
            taxon_name: "Roseus Thorneus",
            wikipedia_url: "https://en.wikipedia.org/wiki/RosePetal",
          };
        const output = checkValidNewSighting(input)
        expect(output).toBe(true)
    })
    test("Returns false when the new sighting values have incorrect data types", () => {
        const input = {
            uploaded_image: "https://example.com/images/petal2.jpg",
            user_id: "2",
            long_position: "44.89763",
            lat_position: -11.15632,
            common_name: ["Rose Petal", ["flower"]],
            taxon_name: "Roseus Thorneus",
            wikipedia_url: "https://en.wikipedia.org/wiki/RosePetal",
          };
        const output = checkValidNewSighting(input)
        expect(output).toBe(false)
    })
})


describe("Check user exists", () => {
    test("Resolves to an object", () => {
        const username = "nature01"
        const email = "hellonature@gmail.com"
        return checkUserExists(username, email).then((result) => {
            expect(typeof result).toBe("object")
        });
    })
    test("Resolves to an object of {username: true} when a username already exists", () => {
        const username = "ilovetrees"
        const email = "hellonature@gmail.com"
        return checkUserExists(username, email).then((result) => {
            expect(result).toEqual({ username: true });
        });
    });
    test("Resolves to an object of {email: true} when an email already exists", () => {
        const username = "nature01"
        const email = "iloveplants@gmail.com"
        return checkUserExists(username, email).then((result) => {
            expect(result).toEqual({ email: true });
        });
    });
    test("Resolves to an object of {username: true, email: true} when a username and email already exists", () => {
        const username = "ilovetrees"
        const email = "iloveplants@gmail.com"
        return checkUserExists(username, email).then((result) => {
            expect(result).toEqual({ username: true, email: true });
        });
    });
    test("Resolves to an empty object when the username and email doesn't already exist", () => {
        const username = "ilovetrees2"
        const email = "iloveplants2@gmail.com"
        return checkUserExists(username, email).then((result) => {
            expect(result).toEqual({});
        });
    });
});
