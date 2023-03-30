const { writeFileSync } = require("fs");

writeFileSync(
    "./dist/cjs/package.json",
    `{
    "type" : "commonjs"
}`,
);
writeFileSync(
    "./dist/esm/package.json",
    `{
    "type" : "module"
}`,
);
