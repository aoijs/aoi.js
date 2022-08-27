"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$addActionRow',
    description: 'Creates an action row.',
    execute: function () {
        this.container.data.components.push(new builders_1.ActionRowBuilder());
        return this.ok();
    }
});
//# sourceMappingURL=addActionRow.js.map