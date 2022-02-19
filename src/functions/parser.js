const fs = require("fs");
const Group = require("../cachehandler/group.js");
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

  for (const file of filelist) {
    const code = fs.readFileSync(`${__dirname}/Funcs/${x}/${file}`).toString();
    const codeLines = code.split("\n");
    const lines =
      codeLines[codeLines.findIndex((z) => z.includes("inside.splits"))];
    if (lines?.includes("const") || lines?.includes("let")) {
      const res = lines.split("=");
      res.pop();
      grp.set(
        `$${file.replace(".js", "").toLowerCase()}`,
        res.join("=").replace("let", "").replace("const", "").trim(),
      );
    } else if (!lines) {
      grp.set(`$${file.replace(".js", "").toLowerCase()}`, "usage not found");
    } else {
      const usagepart =
        codeLines[codeLines.findIndex((z) => z.includes("inside.splits")) - 1];
      const res = usagepart.split("=");
      res.pop();
      grp.set(
        `$${file.replace(".js", "").toLowerCase()}`,
        res.join("=").replace("let", "").replace("const", "").trim(),
      );
    }
  }
});

module.exports = { functions, maps, grp };
