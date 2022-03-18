"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const generateFunctionDocumentation_1 = __importDefault(require("../generateFunctionDocumentation"));
const updateSummaryFunctions_1 = __importDefault(require("../updateSummaryFunctions"));
const files = (0, fs_1.readdirSync)(__dirname + `/../../functions/`).filter(c => c.endsWith('.js'));
console.log(`Generating documentation for ${files.length} functions...`);
if (!(0, fs_1.existsSync)(__dirname + `/../../../docs/functions/available-functions`)) {
    (0, fs_1.mkdirSync)(__dirname + `/../../../docs/functions/available-functions`);
}
for (let i = 0, len = files.length; i < len; i++) {
    const fn = require(`../../functions/${files[i]}`).default;
    const str = (0, generateFunctionDocumentation_1.default)(fn);
    (0, fs_1.writeFileSync)(__dirname + `/../../../docs/functions/available-functions/${files[i].replace(".js", '.md')}`, str, 'utf-8');
    console.log(`Generated documentation file for ${files[i]}.`);
}
(0, fs_1.writeFileSync)(__dirname + `/../../../docs/_sidebar.md`, (0, updateSummaryFunctions_1.default)());
console.log(`Finished generating documentation.`);
//# sourceMappingURL=docgen.js.map