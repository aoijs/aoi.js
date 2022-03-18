"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(index, expects) {
    return function (target, property, descriptor) {
        const fn = descriptor.value;
        descriptor.value = function (...params) {
            const arg = params[index];
            if (arg === undefined || arg === null) {
                throw new Error(`Argument #${index + 1} of ${this.constructor.name}#${fn.name} is required.`);
            }
            if (expects && typeof arg !== expects) {
                throw new Error(`Argument #${index + 1} of ${this.constructor.name}#${fn.name} expects ${expects}, got ${typeof arg}.`);
            }
            const res = fn.call(this, ...params);
            return res;
        };
    };
}
exports.default = default_1;
//# sourceMappingURL=required.js.map