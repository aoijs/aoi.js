const fs = require("fs");
const { Group } = require("@aoijs/aoi.structures");
const path = require("path");

const maps = {};
const grp = new Group();

const functions = fs
    .readdirSync(path.join(__dirname, "../functions"))
    .filter((file) => file.endsWith(".js"))
    .map((file) => {
        const functionName = file.split(".js")[0];
        maps[functionName] = functionName;
        return "$" + functionName;
    });

module.exports = { functions, maps, grp };
