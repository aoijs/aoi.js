"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AoiError_1 = require("../../core/AoiError");
const isBoolean_1 = __importDefault(require("./isBoolean"));
function default_1(value1, op, value2) {
    if (!op && value2 === null) {
        if (!(0, isBoolean_1.default)(value1.toString()))
            return null;
        return value1 === 'true';
    }
    if (!["==", "!="].some(c => op === c)) {
        value1 = Number(value1);
        value2 = Number(value2);
    }
    value2 = value2;
    switch (op) {
        case '==': {
            return value1 === value2;
        }
        case '>': {
            return value1 > value2;
        }
        case '>=': {
            return value1 >= value2;
        }
        case '<=': {
            return value1 <= value2;
        }
        case '<': {
            return value1 < value2;
        }
        case '!=': {
            return value1 !== value2;
        }
        default: {
            throw new AoiError_1.AoiError("UNSUPPORTED_OPERATOR", op);
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=checkCondition.js.map