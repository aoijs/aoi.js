"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AoiError = void 0;
const ErrorMessages_1 = require("../typings/enums/ErrorMessages");
class AoiError extends Error {
    constructor(msg, ...params) {
        super(AoiError.#create(msg, ...params));
    }
    static #create(msg, ...params) {
        let code = ErrorMessages_1.ErrorMessages[msg];
        if (code && (!code.includes('_') || code.includes('$1'))) {
            return this.#create(code, ...params);
        }
        params.map((x, y) => msg = msg.replaceAll(`$${y + 1}`, `${x}`));
        return msg;
    }
}
exports.AoiError = AoiError;
//# sourceMappingURL=AoiError.js.map