const seed = require("./seed");
const db = require("../connection");
const data = require("../data/index");

seed(data).then(() => {
  return db.end();
});
