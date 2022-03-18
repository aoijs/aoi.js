"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$environment',
    description: 'gets a environment key value.',
    brackets: true,
    returns: 'STRING',
    nullable: true,
    fields: [
        {
            name: 'keys',
            description: 'the keys to access.',
            type: 'STRING',
            rest: true,
            required: true
        }
    ],
    execute: async function (fn) {
        return await this.manage(await fn.resolveArray(this), s => {
            return this.ok(this.getEnvironmentValue(...s));
        });
    }
});
//# sourceMappingURL=environment.js.map