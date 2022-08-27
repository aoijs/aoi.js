"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AoiError_1 = require("../../core/AoiError");
const Return_1 = require("../../structures/Return");
const ErrorMessages_1 = require("../../typings/enums/ErrorMessages");
const ReturnType_1 = require("../../typings/enums/ReturnType");
const RuntimeErrorType_1 = require("../../typings/enums/RuntimeErrorType");
const toTitleCase_1 = require("./toTitleCase");
const ERR_TYPE = 'AoiError';
function createRuntimeError(arg, fn, type, input, argType) {
    const overlay = `\`${fn.image}\``;
    switch (type) {
        case RuntimeErrorType_1.RuntimeErrorType.INVALID_INPUT: {
            return new Return_1.Return(ReturnType_1.ReturnType.Error, `${ERR_TYPE}: Invalid input '${input}' does not match type '${(0, toTitleCase_1.toTitleCase)(argType)}' in ${overlay}.`);
        }
        case RuntimeErrorType_1.RuntimeErrorType.OTHER: {
            return new Return_1.Return(ReturnType_1.ReturnType.Error, `${ERR_TYPE}: ${input} in ${overlay}`);
        }
        case RuntimeErrorType_1.RuntimeErrorType.INVALID_DATA: {
            return new Return_1.Return(ReturnType_1.ReturnType.Error, `${ERR_TYPE}: Invalid ${input} given '${argType}' in ${overlay}.`);
        }
        case RuntimeErrorType_1.RuntimeErrorType.MISSING_FIELD: {
            return new Return_1.Return(ReturnType_1.ReturnType.Error, `${ERR_TYPE}: Missing field '${input}' in ${overlay}.`);
        }
        case RuntimeErrorType_1.RuntimeErrorType.UNKNOWN_PROPERTY: {
            return new Return_1.Return(ReturnType_1.ReturnType.Error, `${ERR_TYPE}: Unknown property '${input}' given in ${overlay}.`);
        }
        case RuntimeErrorType_1.RuntimeErrorType.UNKNOWN_OPERATOR: {
            return new Return_1.Return(ReturnType_1.ReturnType.Error, `${ERR_TYPE}: No operator found in ${overlay}.`);
        }
        default: {
            throw new AoiError_1.AoiError(ErrorMessages_1.ErrorMessages.UNKNOWN_RUNTIME_ERROR, type);
        }
    }
}
exports.default = createRuntimeError;
//# sourceMappingURL=createRuntimeError.js.map