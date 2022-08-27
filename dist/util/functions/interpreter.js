"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InterpreterReturnType_1 = require("../constants/enums/InterpreterReturnType");
const cast_1 = __importDefault(require("./cast"));
const createThisArg_1 = __importDefault(require("./createThisArg"));
async function interpreter(data) {
    const executor = (0, createThisArg_1.default)(data);
    const compiler = executor.command.compiler;
    const len = compiler.parsedFunctions.length;
    const arr = new Array(len);
    for (let i = 0; i < len; i++) {
        const fn = compiler.parsedFunctions[i];
        const res = await fn.data.execute.call(executor, fn);
        if (res.isAnyError()) {
            return (0, cast_1.default)(await executor.handleError(res));
        }
        if (res.isReturnKeyword()) {
            return (0, cast_1.default)(res.unwrap());
        }
        arr[i] = res.unwrapAs();
    }
    const output = compiler.executor(arr);
    executor.container.data.content = output;
    switch (data.return) {
        case InterpreterReturnType_1.InterpreterReturnType.Container: {
            return executor.container;
        }
        case InterpreterReturnType_1.InterpreterReturnType.Output: {
            return output;
        }
        default: {
            const m = await executor.container.send();
            return null;
        }
    }
}
exports.default = interpreter;
//# sourceMappingURL=interpreter.js.map