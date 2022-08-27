"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const structures_1 = require("../structures");
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$addField',
    description: 'Add an embed field.',
    brackets: true,
    fields: [
        {
            name: 'index',
            description: 'the embed to add this field to',
            required: true,
            type: 'NUMBER'
        },
        {
            name: 'name',
            type: 'STRING',
            required: true,
            description: 'the field name'
        },
        {
            name: 'value',
            type: 'STRING',
            required: true,
            description: 'the field value'
        },
        {
            name: 'inline',
            type: 'BOOLEAN',
            description: 'whether this field should appear inline'
        }
    ],
    execute: async function (fn) {
        return this.manage(await fn.resolveArray(this), async ([index, name, value, inline]) => {
            this.embed(index).addFields({
                name,
                value,
                inline: inline ?? undefined
            });
            return structures_1.Return.string();
        });
    }
});
//# sourceMappingURL=addField.js.map