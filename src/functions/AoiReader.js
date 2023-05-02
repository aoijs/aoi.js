const fs = require("fs");
const { Group } = require("@akarui/structures");

const maps = {};
const grp = new Group();

const functions = fs
    .readdirSync(__dirname + "/Funcs")
    .flatMap((dir) => {
        const files = fs.readdirSync(__dirname + `/Funcs/${dir}`);
        maps[dir] = files.map((file) => file.split(".js")[0]);
        return files.map((file) => "$" + file.split(".js")[0]);
    });

module.exports = { functions, maps, grp };
