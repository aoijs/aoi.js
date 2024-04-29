const fs = require("fs");
const { Group } = require("@akarui/structures");
const path = require("path");

const maps = {};
const grp = new Group();

const functions = fs
    .readdirSync(path.join(__dirname, "../functions"))
    .flatMap((dir) => {
        const files = fs.readdirSync(path.join(__dirname, `../functions/${dir}`));
        maps[dir] = files.map((file) => file.split(".js")[0]);
        return files.map((file) => "$" + file.split(".js")[0]);
    });

module.exports = { functions, maps, grp };
