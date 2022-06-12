"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Byte = void 0;
class Byte {
    name;
    size;
    data;
    type;
    constructor(name, type, size) {
        this.name = name;
        this.size = size;
        this.type = type;
        this.data = type === "string" ? [] : type === "number" ? ["00"] : [];
    }
}
exports.Byte = Byte;
//# sourceMappingURL=byte.js.map