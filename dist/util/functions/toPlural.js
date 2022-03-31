"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPluralAmount = exports.toPlural = void 0;
function toPlural(str, amount, replacement) {
    return amount === 1 ? str : replacement ?? `${str}s`;
}
exports.toPlural = toPlural;
function toPluralAmount(str, amount, replacement) {
    return amount === 1 ? `${amount} ${str}` : `${amount} ${replacement ?? `${str}s`}`;
}
exports.toPluralAmount = toPluralAmount;
//# sourceMappingURL=toPlural.js.map