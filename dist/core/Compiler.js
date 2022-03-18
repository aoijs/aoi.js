"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compiler = void 0;
const Function_1 = require("../structures/Function");
const FunctionManager_1 = __importDefault(require("../structures/FunctionManager"));
class Compiler {
    system = 0;
    cacheName;
    functions = [];
    code = "";
    constructor(cacheName = 'SYSTEM') {
        this.cacheName = cacheName;
    }
    get alloc() {
        const buff = Buffer.allocUnsafe(this.cacheName.length + 4);
        buff.write(this.cacheName);
        buff.writeUInt32LE(this.system++, this.cacheName.length);
        return buff.toString('utf-8');
    }
    #compileStage(ref, arr, str, index) {
        let inside = '';
        let compiled = '';
        for (let i = index + 1, len = str.length; i < len; i++) {
            const char = str[i];
            const data = arr[0]?.index === i ? arr.shift() : null;
            if (data) {
                const fn = new Function_1.Function(data.function, this.alloc);
                if (!data.function.brackets) {
                    inside += fn.data.name;
                    compiled += fn.id;
                    ref.overloads.push(fn);
                    i += fn.data.name.length - 1;
                    continue;
                }
                else {
                    const isBracket = str[i + data.function.name.length] === '[';
                    if (data.function.optional && !isBracket) {
                        inside += fn.data.name;
                        compiled += fn.id;
                        ref.overloads.push(fn);
                        i += fn.data.name.length - 1;
                        continue;
                    }
                    if (!isBracket) {
                        throw new Error("owa");
                    }
                    const res = this.#compileStage(fn, arr, str, i + fn.data.name.length);
                    fn.setInside(res.compiled);
                    ref.overloads.push(fn);
                    inside += `${fn.data.name}[${res.code}]`;
                    compiled += fn.id;
                    i = res.index;
                }
            }
            else {
                if (char === ']') {
                    index = i;
                    break;
                }
                else {
                    inside += char;
                    compiled += char;
                }
            }
        }
        ref.setInside(compiled);
        return {
            index: index,
            code: inside,
            compiled
        };
    }
    compile(str) {
        const arr = Array.from(str.matchAll(FunctionManager_1.default.fregex)).map(r => ({
            index: r.index,
            function: FunctionManager_1.default.nativeFunctions.get(r[1])
        }));
        this.code = str;
        for (let i = 0, len = str.length; i < len && arr.length !== 0; i++) {
            const data = arr[0]?.index === i ? arr.shift() : null;
            if (data) {
                const fn = new Function_1.Function(data.function, this.alloc);
                if (!data.function.brackets) {
                    this.code = this.code.replace(fn.data.name, fn.id);
                    i += data.function.name.length - 1;
                    this.functions.push(fn);
                    fn.split();
                    continue;
                }
                else {
                    const isBracket = str[i + data.function.name.length] === '[';
                    if (data.function.optional && !isBracket) {
                        i += data.function.name.length - 1;
                        this.code = this.code.replace(fn.data.name, fn.id);
                        this.functions.push(fn);
                        fn.split();
                        continue;
                    }
                    if (!isBracket) {
                        throw new Error("owa");
                    }
                    const res = this.#compileStage(fn, arr, str, i + data.function.name.length);
                    this.code = this.code.replace(`${fn.data.name}[${res.code}]`, fn.id);
                }
                this.functions.push(fn);
                fn.split();
            }
        }
        return this;
    }
    reset() {
        this.system = 0;
        this.code = '';
        this.functions = [];
        return this;
    }
}
exports.Compiler = Compiler;
//# sourceMappingURL=Compiler.js.map