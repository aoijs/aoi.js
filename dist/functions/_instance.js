"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Return_1 = require("../structures/Return");
const cast_1 = __importDefault(require("../util/functions/cast"));
const createNativeFunction_1 = __importDefault(require("../util/functions/createNativeFunction"));
exports.default = (0, createNativeFunction_1.default)({
    name: '$_instance',
    description: 'Returns the instance of the context, this function is unsafe.',
    returns: 'STRING',
    execute: async function (fn) {
        return Return_1.Return.string((0, cast_1.default)(this.context.data).constructor.name);
    }
});
//# sourceMappingURL=_instance.js.map