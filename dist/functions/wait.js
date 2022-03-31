"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
const sleep_1 = __importDefault(require("../util/functions/sleep"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$wait',
    description: 'stops code execution for given time',
    fields: [
        {
            name: 'time',
            description: 'for how long should the execution remain stopped',
            type: 'TIME',
            required: true
        }
    ],
    brackets: true,
    execute: async function (fn) {
        return this.manage(await fn.resolveArray(this), async ([time]) => {
            await (0, sleep_1.default)(time);
            return this.ok();
        });
    }
});
//# sourceMappingURL=wait.js.map