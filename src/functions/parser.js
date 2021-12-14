const fs = require("fs");
const maps = {};
const functions = fs
    .readdirSync(__dirname + "/Funcs")
    .map((x) => fs.readdirSync(__dirname + `/Funcs/${x}`))
    .map((x) => x.join(","))
    .join(",")
    .split(",")
    .map((x) => "$" + x.split(".js")[0]);

fs.readdirSync(__dirname + "/Funcs").map(
    (x) =>
        (maps[x] = fs
            .readdirSync(__dirname + "/Funcs/" + x)
            .map((y) => y.split(".js")[0])),
);

module.exports = {functions, maps};
