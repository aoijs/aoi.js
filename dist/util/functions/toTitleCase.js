"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTitleCase = void 0;
function toTitleCase(str, splitter, sep) {
    return typeof splitter === 'string' ? str.split(splitter).map(c => toTitleCase(c)).join(sep ?? ' ') : str[0].toUpperCase() + str.slice(1).toLowerCase();
}
exports.toTitleCase = toTitleCase;
//# sourceMappingURL=toTitleCase.js.map