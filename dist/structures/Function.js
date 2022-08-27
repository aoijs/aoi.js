"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Function = void 0;
const option_1 = __importDefault(require("../util/functions/option"));
const Return_1 = require("./Return");
const ReturnType_1 = require("../typings/enums/ReturnType");
const AoiFunctionManager_1 = __importDefault(require("../core/AoiFunctionManager"));
const createRuntimeError_1 = __importDefault(require("../util/functions/createRuntimeError"));
const RuntimeErrorType_1 = require("../typings/enums/RuntimeErrorType");
const noop_1 = __importDefault(require("../util/functions/noop"));
const Regexes_1 = require("../typings/namespaces/Regexes");
const BooleanInput_1 = __importDefault(require("../util/constants/BooleanInput"));
const intoFunction_1 = __importDefault(require("../util/functions/intoFunction"));
const AoiOperators_1 = __importDefault(require("../typings/enums/AoiOperators"));
const checkCondition_1 = __importDefault(require("../util/functions/checkCondition"));
class Function {
    data;
    inside = (0, option_1.default)();
    fields = (0, option_1.default)();
    conditionFields = new Array();
    id;
    executor;
    constructor(data, id) {
        this.data = data;
        this.id = id;
    }
    setInside(str) {
        this.inside = str;
        if (this.inside !== null) {
            this.executor = (0, intoFunction_1.default)(this.inside);
        }
        return this;
    }
    async resolveConditionField(arg, data) {
        const lhs = await this.resolveField(arg, data.left);
        if (arg.mustReturn(lhs)) {
            return lhs;
        }
        if (data.op) {
            const rhs = await this.resolveField(arg, data.right);
            if (arg.mustReturn(rhs)) {
                return rhs;
            }
            return (0, checkCondition_1.default)(lhs.unwrapAs(), data.op, rhs.unwrapAs());
        }
        else {
            return (0, checkCondition_1.default)(lhs.unwrapAs(), null, null);
        }
    }
    getConditionField(pos) {
        if (this.conditionFields[pos] !== undefined)
            return this.conditionFields[pos];
        const normal = this.field(pos);
        if (!normal)
            return null;
        const op = AoiOperators_1.default.find(x => normal.value.includes(x));
        if (!op) {
            return {
                op: null,
                right: null,
                value: normal.value,
                left: {
                    executor: normal.executor,
                    overloads: normal.overloads,
                    value: normal.value
                }
            };
        }
        const [left, right] = normal.value.split(op);
        const newer = {
            value: normal.value,
            op,
            left: {
                executor: (0, intoFunction_1.default)(left),
                value: left,
                overloads: normal.overloads.filter(c => left.includes(c.id))
            },
            right: {
                executor: (0, intoFunction_1.default)(right),
                value: right,
                overloads: normal.overloads.filter(c => right.includes(c.id))
            },
        };
        this.conditionFields[pos] = newer;
        return newer;
    }
    /**
     * Gets an image of this function.
     */
    get image() {
        if (!this.data.brackets)
            return this.data.name;
        if (this.data.optional && this.inside === null) {
            return this.data.name;
        }
        else {
            let inside = this.inside;
            for (let i = 0, len = this.fields.length; i < len; i++) {
                const field = this.fields[i];
                for (let x = 0, len2 = field.overloads.length; x < len2; x++) {
                    const overload = field.overloads[x];
                    inside = inside.replace(overload.id, overload.image);
                }
            }
            return `${this.data.name}[${inside}]`;
        }
    }
    async resolveAll(arg) {
        if (!this.hasFields())
            return new Return_1.Return(ReturnType_1.ReturnType.Success, '');
        const fields = this.fields;
        const code = new Array();
        for (let i = 0, len = fields.length; i < len; i++) {
            const field = fields[i];
            const val = await this.resolveField(arg, field);
            if (!val.isSuccess()) {
                return val;
            }
            code.push(val.as().unwrap());
        }
        return new Return_1.Return(ReturnType_1.ReturnType.Success, code.join(';'));
    }
    /**
     * This function is not fully optimized, beware from using it too much.
     * @param arg
     * @param field
     * @param code
     * @returns
     */
    async resolveCode(arg, field, code) {
        if (!field || !code)
            return Return_1.Return.string('');
        for (let i = 0, len = field.overloads.length; i < len; i++) {
            const overload = field.overloads[i];
            if (!code.includes(overload.id)) {
                continue;
            }
            const res = await overload.data.execute.call(arg, overload);
            if (!res.isSuccess()) {
                return res;
            }
            code = code.replace(overload.id, res.unwrapAs());
        }
        return Return_1.Return.string(code);
    }
    /**
     * This function is not fully optimized, beware from using it too much.
     * @param arg
     * @param fields
     * @param codes
     * @returns
     */
    async resolveCodes(arg, fields, codes) {
        if (!fields?.length || !codes?.length)
            return Return_1.Return.success([]);
        const newer = new Array();
        for (let i = 0, len = fields.length; i < len; i++) {
            const field = fields[i];
            const code = codes[i];
            if (!field || !code) {
                newer.push('');
                continue;
            }
            const t = performance.now();
            const res = await this.resolveCode(arg, field, code);
            if (!res.isSuccess()) {
                return res;
            }
            newer.push(res.unwrapAs());
        }
        return Return_1.Return.success(newer);
    }
    async resolveArray(arg, offset = 0) {
        const fields = this.data.fields;
        const parsedArgs = [];
        for (let i = offset, len = fields.length; i < len; i++) {
            const field = fields[i];
            const unresolved = field.rest ? this.fields.slice(i) : [this.fields[i]];
            for (let x = 0, len2 = unresolved.length; x < len2; x++) {
                const data = unresolved[x];
                if (!data) {
                    if (field.default) {
                        const got = await field.default.call(arg);
                        parsedArgs.push(got);
                        continue;
                    }
                    if (!field.required) {
                        parsedArgs.push(null);
                        continue;
                    }
                    return (0, createRuntimeError_1.default)(arg, this, RuntimeErrorType_1.RuntimeErrorType.MISSING_FIELD, field.name);
                }
                let res = await this.resolveField(arg, data);
                if (!res.isSuccess()) {
                    return res;
                }
                const input = res.unwrapAs();
                const parsed = await this.#parse(parsedArgs, arg, field, input);
                if (!parsed.isSuccess()) {
                    return parsed;
                }
                parsedArgs.push(parsed.unwrap());
            }
        }
        return new Return_1.Return(ReturnType_1.ReturnType.Success, parsedArgs);
    }
    async #parse(args, arg, field, input) {
        let data = input;
        //@ts-ignore
        const reject = createRuntimeError_1.default.bind(null, arg, this, RuntimeErrorType_1.RuntimeErrorType.INVALID_INPUT, input, field.type);
        switch (field.type) {
            case 'TIME': {
                try {
                    const ms = arg.bot.parser.parseToMS(input);
                    data = ms;
                }
                catch (error) {
                    return reject();
                }
                break;
            }
            case 'USER': {
                if (!Regexes_1.Regexes.DISCORD_ID.test(input)) {
                    return reject();
                }
                const u = await arg.bot.client.users.fetch(input).catch(noop_1.default);
                if (!u) {
                    return reject();
                }
                data = u;
                break;
            }
            case 'NUMBER': {
                const n = Number(input);
                if (isNaN(n) || n > Number.MAX_SAFE_INTEGER)
                    return reject();
                data = n;
                break;
            }
            case 'BOOLEAN': {
                const res = BooleanInput_1.default[input];
                if (res === undefined)
                    return reject();
                data = res;
                break;
            }
            case 'GUILD': {
                const guild = arg.bot.client.guilds.cache.get(input);
                if (!guild)
                    return reject();
                data = guild;
                break;
            }
            case 'MEMBER': {
                const guild = args[field.pointer];
                if (!Regexes_1.Regexes.DISCORD_ID.test(input))
                    return reject();
                const member = await guild.members.fetch(input).catch(noop_1.default);
                if (!member)
                    return reject();
                data = member;
                break;
            }
            case 'MESSAGE': {
                const channel = args[field.pointer];
                if (!Regexes_1.Regexes.DISCORD_ID.test(input))
                    return reject();
                const msg = await channel.messages?.fetch(input).catch(noop_1.default);
                if (!msg)
                    return reject();
                data = msg;
                break;
            }
            case 'CHANNEL': {
                const channel = arg.bot.client.channels.cache.get(input);
                if (!channel)
                    return reject();
                data = channel;
                break;
            }
            case 'ENUM': {
                const enums = field.choices;
                let got = null;
                input = input.toLowerCase();
                for (let i = 0, len = enums.length; i < len; i++) {
                    const [key, value] = enums[i];
                    if (key.toLowerCase() === input) {
                        got = value;
                        break;
                    }
                }
                if (!got)
                    return reject();
                data = got;
                break;
            }
        }
        return new Return_1.Return(ReturnType_1.ReturnType.Success, data);
    }
    setFields(fields) {
        this.fields = [];
        for (let i = 0, len = fields.length; i < len; i++) {
            const raw = fields[i];
            const overloads = [];
            for (let x = 0, len2 = raw.overloads.length; x < len2; x++) {
                const overload = raw.overloads[x];
                const data = AoiFunctionManager_1.default.allFunctions.get(overload.name);
                const fn = Function.create(data, overload);
                overloads.push(fn);
            }
            this.fields.push({
                value: raw.value,
                overloads: overloads,
                executor: (0, intoFunction_1.default)(raw.value)
            });
        }
        return this;
    }
    static create(raw, data) {
        return new Function(raw, data.id)
            .setFields(data.fields)
            .setInside(data.inside);
    }
    get str() {
        return this.inside ?? undefined;
    }
    field(index) {
        return this.fields?.[index];
    }
    hasFields() {
        return Boolean(this.fields?.length);
    }
    async resolveField(arg, field) {
        if (!field)
            return new Return_1.Return(ReturnType_1.ReturnType.Success);
        const { overloads } = field;
        const arr = [];
        for (let i = 0, len = overloads.length; i < len; i++) {
            const overload = overloads[i];
            const res = await overload.data.execute.call(arg, overload);
            if (arg.mustReturnPlusBreak(res)) {
                return res;
            }
            const str = res.as().unwrap();
            arr.push(str);
        }
        return Return_1.Return.string(field.executor(arr));
    }
}
exports.Function = Function;
//# sourceMappingURL=Function.js.map