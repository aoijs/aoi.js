"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function default_1(iterator, cb) {
    let item;
    while (item = iterator.next()) {
        if (item.done)
            break;
        await cb(item.value);
    }
}
exports.default = default_1;
//# sourceMappingURL=iterate.js.map