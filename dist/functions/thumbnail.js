"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Return_1 = require("../structures/Return");
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$thumbnail',
    description: 'Add an embed description.',
    brackets: true,
    fields: [
        {
            name: 'index',
            description: 'the embed to add this thumbnail to',
            required: true,
            type: 'NUMBER'
        },
        {
            name: 'url',
            type: 'STRING',
            description: 'the thumbnail url'
        }
    ],
    execute: async function (fn) {
        return this.manage(await fn.resolveArray(this), async ([index, ...data]) => {
            this.embed(index).setThumbnail(data.join(';'));
            return Return_1.Return.string();
        });
    }
});
//# sourceMappingURL=thumbnail.js.map