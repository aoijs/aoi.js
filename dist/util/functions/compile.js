"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AoiFunctionManager_1 = __importDefault(require("../../core/AoiFunctionManager"));
const Compiler_1 = require("../../structures/Compiler");
function default_1(code, insensitive, ref) {
    Compiler_1.Compiler.setFunctions(AoiFunctionManager_1.default.adapter, insensitive);
    return new Compiler_1.Compiler(code, ref).start();
}
exports.default = default_1;
//# sourceMappingURL=compile.js.map