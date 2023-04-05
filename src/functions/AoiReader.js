const fs = require("fs");
const path = require("path");
const { Group } = require("../classes/structures/dist");

const maps = {};
const grp = new Group();

const functions = fs
  .readdirSync(path.join(__dirname, "Funcs"))
  .map((dir) => {
    const files = fs.readdirSync(path.join(__dirname, "Funcs", dir));
    maps[dir] = files.map((file) => file.split(".js")[0]);
    return files.map((file) => "$" + file.split(".js")[0]);
  })
  .reduce((acc, val) => acc.concat(val), []);

module.exports = { functions, maps: Object.values(maps), grp };
