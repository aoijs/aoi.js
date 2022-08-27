"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Return_1 = require("../structures/Return");
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$messageID',
    description: 'Returns the message\'s ID',
    returns: 'STRING',
    nullable: true,
    execute: function () {
        return Return_1.Return.string(this.context.getMessage()?.id);
    }
});
//# sourceMappingURL=messageID.js.map