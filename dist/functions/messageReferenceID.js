"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const structures_1 = require("../structures");
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$messageReferenceID',
    description: 'Returns the message reference ID',
    returns: 'STRING',
    nullable: true,
    execute: function () {
        return structures_1.Return.string(this.context.getMessage()?.reference?.messageId);
    }
});
//# sourceMappingURL=messageReferenceID.js.map