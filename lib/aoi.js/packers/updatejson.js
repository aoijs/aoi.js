const json = require("../site/src/data/data.json");
const typedoc = require("typedoc");
const fs = require("fs");
const path = require("path");
const jsonpath = path.join(process.cwd(), "./site/src/data/data.json");

const entries = Object.entries(typedoc.Models.ReflectionKind).filter(
    (x) => typeof x[1] === "number",
);
console.log(entries);

const getTypePlural = (type) => {
    if (type === "Class") return "classes";
    if (type === "Interface") return "interfaces";
    if (type === "Enum") return "enums";
    if (type === "Function") return "functions";
    if (type === "Variable") return "variables";
    if (type === "TypeAlias") return "typealiases";
    if (type === "ObjectLiteral") return "objectliterals";
    if (type === "TypeParameter") return "typeparameters";
    if (type === "Accessor") return "accessors";
    if (type === "Constructor") return "constructors";
    if (type === "Property") return "properties";
    if (type === "Method") return "methods";
    if (type === "CallSignature") return "callsignatures";
    if (type === "IndexSignature") return "indexsignatures";
    if (type === "ConstructorSignature") return "constructorsignatures";
    if (type === "Parameter") return "parameters";
    if (type === "TypeLiteral") return "typeliterals";
};

const obj = {};

for (const [key, value] of entries) {
    obj[getTypePlural(key)] = [];
}

const RecurSiveDepthLoop = (jsn) => {
    obj[getTypePlural(entries.find((x) => x[1] === jsn.kind)[0])].push(jsn);
};

json.children.forEach(RecurSiveDepthLoop);
for (const key in obj) {
    if (!obj[key].length) delete obj[key];
}

fs.writeFileSync(
    jsonpath,
    JSON.stringify({
        name: "Aoijs",
        children: Object.entries(obj).map((x) => ({
            name: x[0],
            children: x[1],
        })),
    }),
);
