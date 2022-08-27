"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    description: 'the code will be run in a sync block, therefore it won\'t be awaited for execution.',
    brackets: true,
    fields: [
        {
            name: 'codes',
            description: 'codes to run in sync block',
            type: 'STRING',
            rest: true
        }
    ],
    name: '$sync',
    execute: async function (fn) {
        fn.resolveArray(this)
            .then(r => this.manage(r, _ => this.ok()));
        return this.ok();
    }
});
//# sourceMappingURL=sync.js.map