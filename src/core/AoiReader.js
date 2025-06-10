const fs = require("fs");
const { Group } = require("@aoijs/aoi.structures");
const path = require("path");

const maps = {};
const grp = new Group();

const functions = fs.readdirSync(path.join(__dirname, "../functions")).flatMap((dir) => {
    const dirPath = path.join(__dirname, `../functions/${dir}`);
    if (!fs.statSync(dirPath).isDirectory()) return [];

    const files = fs.readdirSync(dirPath).filter((file) => {
        const filePath = path.join(dirPath, file);
        return fs.statSync(filePath).isFile();
    });

    maps[dir] = files.map((file) => file.split(".js")[0]);
    return files.map((file) => "$" + file.split(".js")[0]);
});

module.exports = { functions, maps, grp };