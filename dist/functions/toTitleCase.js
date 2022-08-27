"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
const toTitleCase_1 = require("../util/functions/toTitleCase");
exports.default = (0, createNativeFunction_1.default)({
    name: '$toTitleCase',
    returns: 'STRING',
    description: 'returns given string all lowercase except first letter.',
    brackets: true,
    fields: [
        {
            name: 'text',
            description: 'the text to convert to title',
            type: 'STRING',
            required: true
        },
        {
            name: 'splitter',
            description: 'the splitter to use for every match',
            type: 'STRING'
        },
        {
            name: 'separator',
            description: 'separator to use for each match',
            type: 'STRING'
        }
    ],
    execute: async function (fn) {
        return this.manage(await fn.resolveArray(this), ([text, split, sep]) => {
            return this.ok((0, toTitleCase_1.toTitleCase)(text, split, sep));
        });
    }
});
//# sourceMappingURL=toTitleCase.js.map