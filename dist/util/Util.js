"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
class Util extends null {
    constructor() {
    }
    static mergeDefault(target, source) {
        const keys = Object.keys(source);
        for (let i = 0, len = keys.length; i < len; i++) {
            const key = keys[i];
            const current = target[key];
            const value = source[key];
            if (current === undefined) {
                target[key] = value;
            }
            else if (current === null) {
            }
            else {
                if (!Array.isArray(value) && typeof value === 'object') {
                    Util.mergeDefault(current, value);
                }
            }
        }
        return target;
    }
}
exports.Util = Util;
//# sourceMappingURL=Util.js.map