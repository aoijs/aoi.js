"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (str) => {
    str = str.replace(/`/g, '\\`');
    const matches = str.match(/SYSTEM_FUNCTION\((\d+)\)/g) ?? [];
    for (let i = 0, len = matches.length; i < len; i++) {
        str = str.replace(matches[i], "${args[" + i + "] ?? ''}");
    }
    return new Function('args', `return \`${str}\``);
};
//# sourceMappingURL=intoFunction.js.map