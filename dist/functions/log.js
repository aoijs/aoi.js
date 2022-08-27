"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$log',
    description: 'logs data into console',
    brackets: true,
    fields: [
        {
            name: 'message',
            required: true,
            rest: true,
            description: 'the data to log',
            type: 'STRING',
        }
    ],
    execute: async function (d) {
        return this.manage(await d.resolveArray(this), data => {
            console.log(...data);
            return this.ok();
        });
    }
});
//# sourceMappingURL=log.js.map