"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compiler = void 0;
const aoi_compiler_1 = require("aoi-compiler");
const AoiFunctionManager_1 = __importDefault(require("../core/AoiFunctionManager"));
const intoFunction_1 = __importDefault(require("../util/functions/intoFunction"));
const Function_1 = require("./Function");
class Compiler extends aoi_compiler_1.Compiler {
    parsedFunctions = [];
    executor;
    start() {
        super.start();
        const fns = super.getFunctions();
        this.executor = (0, intoFunction_1.default)(this.getCompiledCode());
        for (let i = 0, len = fns.length; i < len; i++) {
            const data = fns[i];
            const raw = AoiFunctionManager_1.default.allFunctions.get(data.name);
            const fn = Function_1.Function.create(raw, data);
            this.parsedFunctions.push(fn);
        }
        return this;
    }
}
exports.Compiler = Compiler;
//# sourceMappingURL=Compiler.js.map