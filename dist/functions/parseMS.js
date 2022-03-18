"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Return_1 = require("../structures/Return");
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$parseMS',
    description: 'parses ms to duration',
    brackets: true,
    fields: [
        {
            name: 'ms',
            description: 'the ms to parse to string.',
            type: 'NUMBER',
            required: true
        },
        {
            name: 'limit',
            required: false,
            description: 'limit of units to use.',
            type: 'NUMBER',
            default: () => 2
        },
        {
            name: 'separator',
            required: false,
            description: "The separator to use",
            type: 'STRING',
            default: () => ', '
        },
        {
            name: 'and',
            description: 'whether to put `and` in the last separator.',
            type: 'BOOLEAN',
            default: () => true
        }
    ],
    returns: 'STRING',
    nullable: true,
    execute: async function (fn) {
        return this.manage(await fn.resolveArray(this), async (s) => {
            try {
                const str = this.bot.parser.parseToString(s[0], {
                    and: s[3],
                    separator: s[2],
                    limit: s[1]
                });
                return Return_1.Return.string(str);
            }
            catch (error) {
                return Return_1.Return.string();
            }
        });
    }
});
//# sourceMappingURL=parseMS.js.map