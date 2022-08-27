"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(fn) {
    if (!fn.brackets) {
        return `(\\${fn.name})`;
    }
    else {
        return `(\\${fn.name})(\\[(.*)\\])${fn.optional ? '?' : ''}`;
    }
}
exports.default = default_1;
//# sourceMappingURL=getFunctionRegex.js.map