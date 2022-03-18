"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Return_1 = require("../structures/Return");
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$parseDuration',
    description: 'parses a string to ms',
    brackets: true,
    fields: [
        {
            name: 'duration',
            description: 'the string to parse to ms.',
            type: 'TIME',
            required: true
        }
    ],
    returns: 'NUMBER',
    nullable: true,
    execute: async function (fn) {
        return this.manage(await fn.resolveArray(this), async (s) => {
            return Return_1.Return.string(s[0]);
        });
    }
});
//# sourceMappingURL=parseDuration.js.map