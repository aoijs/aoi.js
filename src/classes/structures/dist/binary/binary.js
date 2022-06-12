"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Binary = void 0;
const StructureErrors_1 = __importDefault(require("../error/StructureErrors"));
const byte_1 = require("./byte");
class Binary {
    size;
    data;
    constructor(size = Infinity) {
        this.size = size;
        this.data = {};
    }
    /**
     * @method newByte
     * @description creates A new Byte data
     * @param name name of the Byte
     * @param type type of the Byte
     * @param size size of the Byte
     * @return Byte
     */
    newByte(name, type, size) {
        const newByte = new byte_1.Byte(name, type, size);
        this.data[name] = newByte;
        return newByte;
    }
    /**
     * @method addByteData
     * @description adds data to that byte
     * @param name name of the byte
     * @param data
     * @return data
     */
    addByteData(name, data) {
        const byte = this.data[name];
        if (!byte) {
            StructureErrors_1.default.BinaryError("InvalidByteError", "addByteData", "Invalid Byte name provided");
        }
        const type = byte.type;
        if (type === "string" && typeof data === "string") {
            byte.data = data.split("").map((x) => x.charCodeAt(0).toString(2));
        }
        else if (type === "number") {
            byte.data = [Number(data).toString(2)];
        }
    }
    /**
     * @method getRawData
     * @description gets the raw  data from byte
     * @param name name of the byte
     * @return {string | string[]} data
     */
    getRawData(name) {
        const { data, type } = this.data[name];
        if (type === "string")
            return data;
        else
            return data[0];
    }
    /**
     * @method getData
     * @description gets data from byte
     * @param name name of the byte
     * @return {string | number } data
     */
    getData(name) {
        const byte = this.data[name];
        const type = byte.type;
        if (type === "string") {
            return byte.data
                .map((bin) => String.fromCharCode(parseInt(bin, 2)))
                .join("");
        }
        else
            return parseInt(byte.data[0], 2);
    }
}
exports.Binary = Binary;
//# sourceMappingURL=binary.js.map