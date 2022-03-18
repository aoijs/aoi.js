"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(en) {
    const values = Object.values(en);
    const arr = new Array();
    for (let i = 0, len = values.length; i < len; i++) {
        const value = values[i];
        if (typeof value === 'string') {
            continue;
        }
        arr.push([
            en[value],
            value
        ]);
    }
    return arr;
}
exports.default = default_1;
//# sourceMappingURL=createEnum.js.map