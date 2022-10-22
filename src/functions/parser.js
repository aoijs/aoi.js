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

    for (const file of filelist) {
        const code = fs.readFileSync(`${__dirname}/Funcs/${x}/${file}`).toString();
        if (code.includes("data.inside.splits")) {
            const beforePart = code.split("data.inside.splits")[0];
            beforePart;
            let usage = beforePart.split(/let |const /g);
            const usagebefore = usage;
            usage = usage.filter(
                (x) => x.trim().startsWith("[") && x.trim().endsWith("="),
            )[0];
            let parsedUsage = usage?.split("=").slice(0, -1).join("=");
            parsedUsage = parsedUsage
                ? "[" +
                parsedUsage
                    .split("[")
                    .slice(1)
                    .join("")
                    .split("]")
                    .slice(0, -1)
                    .join("")
                    .split(",")
                    .map((x) =>
                        x.includes("=") ? x.split("=")[0].trim() + "?" : x.trim(),
                    )
                    .join(";") +
                "]"
                : "Usage Not Found";
            grp.set(`\$${file.replace(".js", "").toLowerCase()}`, parsedUsage);
        } else if (code.includes("inside.splits")) {
            const beforePart = code.split("inside.splits")[0];
            beforePart;
            let usage = beforePart.split(/let|const/g);
            const usagebefore = usage;
            usage = usage.filter(
                (x) => x.trim().startsWith("[") && x.trim().endsWith("="),
            )[0];
            let parsedUsage = usage?.split("=").slice(0, -1).join("=");
            parsedUsage = parsedUsage
                ? "[" +
                parsedUsage
                    .split("[")
                    .slice(1)
                    .join("")
                    .split("]")
                    .slice(0, -1)
                    .join("")
                    .split(",")
                    .filter((x) => x.trim() !== "")
                    .map((x) =>
                        x.includes("=") ? x.split("=")[0].trim() + "?" : x.trim(),
                    )
                    .join(";") +
                "]"
                : "Usage Not Found";
            grp.set(`\$${file.replace(".js", "").toLowerCase()}`, parsedUsage);
        } else if (code.includes("data.inside.inside")) {
            const usage = code
                .split("\n")
                .find((x) => x.includes("data.inside.inside"));
            usage;
            let parsedUsage = usage.split("=").slice(0, -1).join("=");
            parsedUsage;
            parsedUsage = "[" + parsedUsage.replace(/let|const/g, "").trim() + "]";
            grp.set(`\$${file.replace(".js", "").toLowerCase()}`, parsedUsage);
        } else if (code.includes("inside.inside")) {
            const usage = code.split("\n").find((x) => x.includes("inside.inside"));
            usage;
            let parsedUsage = usage.split("=").slice(0, -1).join("=");
            parsedUsage;
            parsedUsage = "[" + parsedUsage.replace(/let|const/g, "").trim() + "]";
            grp.set(`\$${file.replace(".js", "").toLowerCase()}`, parsedUsage);
        } else {
            grp.set(
                `\$${file.replace(".js", "").toLowerCase()}`,
                null,
            );
        }
    }
});

module.exports = {functions, maps, grp};