const fs = require("fs");
const {Group} = require("../classes/structures/dist");
const maps = {};
const grp = new Group();
const functions = fs
    .readdirSync(__dirname + "/Funcs")
    .map((x) => fs.readdirSync(__dirname + `/Funcs/${x}`))
    .map((x) => x.join(","))
    .join(",")
    .split(",")
    .map((x) => "$" + x.split(".js")[0]);

fs.readdirSync(__dirname + "/Funcs").map((x) => {
    const filelist = fs.readdirSync(__dirname + "/Funcs/" + x);
    maps[x] = filelist.map((y) => y.split(".js")[0]);
});

module.exports = {functions, maps, grp};