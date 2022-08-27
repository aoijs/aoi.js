"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Return = void 0;
const util_1 = require("util");
const ReturnType_1 = require("../typings/enums/ReturnType");
const cast_1 = __importDefault(require("../util/functions/cast"));
class Return {
    #content;
    #type;
    constructor(type, content) {
        this.#type = type;
        this.#content = content;
    }
    static string(data) {
        switch (typeof data) {
            case 'undefined': {
                data = '';
                break;
            }
            case 'boolean': {
                data = `${data}`;
                break;
            }
            case 'bigint': {
                data = `${data}`;
                break;
            }
            case 'object': {
                if (data === null) {
                    data = '';
                    break;
                }
                else {
                    data = (0, util_1.inspect)(data, { depth: 0 });
                    break;
                }
            }
            case 'function': {
                data = `${data}`;
                break;
            }
        }
        return new Return(ReturnType_1.ReturnType.Success, data);
    }
    static success(data) {
        return new this(ReturnType_1.ReturnType.Success, data);
    }
    isBreakStatement() {
        return this.#type === ReturnType_1.ReturnType.Break;
    }
    static error(data) {
        return new this(ReturnType_1.ReturnType.Error, data);
    }
    get type() {
        return this.#type;
    }
    isError() {
        return this.#type === ReturnType_1.ReturnType.Error;
    }
    isErrorStatement() {
        return this.#type === ReturnType_1.ReturnType.Statement;
    }
    isAnyError() {
        return this.isError() || this.isErrorStatement();
    }
    isSuccess() {
        return this.#type === ReturnType_1.ReturnType.Success;
    }
    unwrap() {
        return this.#content;
    }
    unwrapAs() {
        return this.#content;
    }
    as() {
        return (0, cast_1.default)(this);
    }
    isAnythingButReturn() {
        return !this.isReturnKeyword();
    }
    isAnythingButSuccess() {
        return !this.isSuccess();
    }
    isAnythingButError() {
        return !this.isAnyError();
    }
    isAnythingButSuccessOrReturn() {
        return !this.isSuccess() && !this.isReturnKeyword();
    }
    isReturnKeyword() {
        return this.#type === ReturnType_1.ReturnType.ReturnKeyword;
    }
}
exports.Return = Return;
//# sourceMappingURL=Return.js.map