const seed = require("./seed");
const db = require("../connection");
const data = require("../data/index");

const runSeed = () => {
  seed(data).then(() => {
    return db.end();
  });
}

runSeed()
