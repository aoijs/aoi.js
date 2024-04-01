import { TranspilerError } from "../core/error.js";
import Scope from "../core/structs/Scope.js";
import FUNCDATA from "../functions/index.js";
import { FunctionData, funcData } from "../typings/interfaces.js";
import { TranspilerCustoms } from "../typings/enums.js";
import { StringObject, parseStringObject } from "../index.js";
import { Command } from "../structures/Command.js";
/**
 * Checks if the brackets in the given code are balanced.
 * @param {string} code - The code to check.
 * @returns {boolean} - Returns true if the brackets are balanced, false otherwise.
 * @example
 * ```js
 * areBracketsBalanced("[]") // true
 * areBracketsBalanced("[[]]") // true
 * areBracketsBalanced("[[]") // false
 * areBracketsBalanced("[]]") // false
 * ```
 */
export function areBracketsBalanced(code: string): boolean {
    const leftbracket = /\[/g;
    const rightbracket = /\]/g;
    const leftbracketCount = code.match(leftbracket)?.length ?? 0;
    const rightbracketCount = code.match(rightbracket)?.length ?? 0;
    return leftbracketCount === rightbracketCount;
}

/**
 * Counts the number of brackets in the given code.
 * @param {string} code - The code to count the brackets in.
 * @returns {Object} - Returns an object containing the number of left and right brackets.
 * @example
 * ```js
 * countBrackets("[]") // { leftbracketCount: 1, rightbracketCount: 1 }
 * countBrackets("[[]]") // { leftbracketCount: 2, rightbracketCount: 2 }
 * ```
 */

export function countBrackets(code: string) {
    const leftbracket = /\[/g;
    const rightbracket = /\]/g;
    const leftbracketCount = code.match(leftbracket)?.length ?? 0;
    const rightbracketCount = code.match(rightbracket)?.length ?? 0;
    return { leftbracketCount, rightbracketCount };
}

/**
 * parse data to its actual type
 * @param {string} text - The string to check.
 * @returns {any} - Returns the parsed data.
 * @example
 * ```js
 * parseData("1") // 1
 * parseData("1n") // 1n
 * parseData("null") // null
 * // and so on...
 * ```
 */
export function parseData(text: string) {
    if (text === "") return text;
    else if (!isNaN(Number(text)) && Number.isSafeInteger(Number(text)))
        return Number(text);
    else if (
        (!isNaN(Number(text)) && !Number.isSafeInteger(text)) ||
        isBigInt(text)
    )
        return BigInt(text.replace("n", ""));
    else if (text === "null") return null;
    else if (text === "undefined") return undefined;
    else if (text === "true" || text === "false") return text === "true";
    else {
        try {
            return JSON.parse(text);
        } catch {
            if (text.startsWith("{") && text.endsWith("}")) {
                const so = new StringObject("{");
                so.addEnd("}");
                let e;
                eval(`e = ${parseStringObject(text, so).solve()}`);
                return e;
            } else if (text.startsWith("[") && text.endsWith("]")) {
                const so = new StringObject("[");
                so.addEnd("]");
                let e;
                eval(`e = ${parseStringObject(text, so).solve()}`);
                return e;
            } else return text;
        }
    }
}

/**
 * Escapes a variable name by wrapping it with '__$' and '$__'.
 *
 * @param {string} name - The variable name to escape.
 * @returns {string} The escaped variable name.
 * @example
 * ```js
 * escapeVars("a") // "__$a$__"
 * ```
 */

export function escapeVars(name: string) {
    return `__$${name}$__`;
}

/**
 * Unescapes a variable name by removing the '__$' and '$__'.
 * @param {string} res - The variable name to unescape.
 * @returns {string} The unescaped variable name.
 * @example
 * ```js
 * unescapeVars("__$a$__") // "a"
 * ```
 */

export function escapeResult(res: string) {
    return `${TranspilerCustoms.FS}${res}${TranspilerCustoms.FE}`;
}

/**
 * Escapes a math result by wrapping it with  TranspilerCustoms.MFS and TranspilerCustoms.MFE.
 * @param {string} res - The math result to escape.
 * @returns {string} The escaped math result.
 * @example
 * ```js
 * escapeMathResult("1+1") // #MATH_FUNCTION_START#1+1#MATH_FUNCTION_END#
 * ```
 * @see {@link TranspilerCustoms}
 */

export function escapeMathResult(res: string) {
    return `${TranspilerCustoms.MFS}${res}${TranspilerCustoms.MFE}`;
}

/**
 * parse the result by removing all the customs
 * @param {string} result - The result to parse.
 * @returns {string} The parsed result.
 * @example
 * ```js
 * parseResult("#MATH_FUNCTION_START#1+1#MATH_FUNCTION_END#") // "1+1"
 * ```
 */

export function parseResult(result: string) {
    if (typeof result !== "string") return result;
    return result
        .replaceAll(TranspilerCustoms.FS, "")
        .replaceAll(TranspilerCustoms.FE, "")
        .replaceAll(TranspilerCustoms.FSEP, ";")
        .replaceAll(TranspilerCustoms.FFUN, "")
        .replaceAll(TranspilerCustoms.FSET, "")
        .replaceAll(TranspilerCustoms.FGET, "")
        .replaceAll(TranspilerCustoms.FISS, "")
        .replaceAll(TranspilerCustoms.FISE, "")
        .replaceAll(TranspilerCustoms.FSS, "")
        .replaceAll(TranspilerCustoms.FSE, "")
        .replaceAll(TranspilerCustoms.FFS, "")
        .replaceAll(TranspilerCustoms.FFE, "")
        .replaceAll(TranspilerCustoms.MFS, "")
        .replaceAll(TranspilerCustoms.MFE, "")
        .replaceAll(TranspilerCustoms.OS, "{")
        .replaceAll(TranspilerCustoms.OE, "}")
        .replaceAll(TranspilerCustoms.OSEP, ":")
        .replaceAll(TranspilerCustoms.AS, "[")
        .replaceAll(TranspilerCustoms.AE, "]")
        .replaceAll(TranspilerCustoms.ASEP, ",");
}

/**
 * remove the set function
 * @param {string} code - The code to parse
 * @returns {string} The parsed result.
 * @example
 * ```js
 * parseResult("#FUNCTION_SETTER#i#FUNCTION_SETTER#") // "i"
 * ```
 */

export function removeSetFunc(code: string) {
    return code
        .replaceAll(TranspilerCustoms.FSET, "")
        .replaceAll(TranspilerCustoms.FFUN, "");
}

/**
 * Wraps a function result string with specific prefix and suffix.
 *
 * @param {string} result - The function result string to wrap.
 * @returns {string} The wrapped function result string.
 *
 * @example
 * ```js
 * escapeFunctionResult("result") // #FUNCTION_FUNCTION_START##FUNCTION_START#result#FUNCTION_END##FUNCTION_FUNCTION_END#
 * ```
 */

export function escapeFunctionResult(result: string) {
    return `${TranspilerCustoms.FFS}${TranspilerCustoms.FS}${result}${TranspilerCustoms.FE}${TranspilerCustoms.FFE}`;
}

/**
 * Checks if the given code has a function.
 * @param {string} code - The code to check.
 * @returns {boolean} - Returns true if the code has a function, false otherwise.
 * @example
 * ```js
 * hasFunction("$ping") // true
 * ```
 */
export function hasFunction(code: string) {
    return functionFinderRegex.test(code);
}

/**
 * Generates data of the given function in the given code.
 * @param {string} code - The code to generate the function data in.
 * @param {string} func - The function to generate the data of.
 * @param {string[]} functions - The list of valid functions.
 * @param {Command} [command] - The command that the code is in.
 * @returns {funcData} - Returns the generated function data.
 * @example
 * ```js
 * getFunctionData("$ping") // { inside: "", total: "$ping", splits: [], funcs: [], parsed: "$ping", type: "getter", code: [Function (anonymous)] }
 * ```
 */

export function getFunctionData(
    code: string,
    func: string,
    functions: string[],
    command?: Command,
): funcData {
    let FuncD = FUNCDATA[func];
    if(func === "$EXECUTEMAINCODEFUNCTION") {
        FuncD = {
            name: "$EXECUTEMAINCODEFUNCTION",
            brackets: true,
            optional: false,
            default: ["void"],
            returns: undefined,
            code: (() => {}) as unknown as FunctionData["code"],
            type: "scope",
            fields: [
                {
                    name: "code",
                    type: "string",
                    required: true,
                }
            ],
            description: "Main Execution Function",
            version: "7.0.0",
            example: "N/A"
        };
    }
    const reg = new RegExp(`${func.replace("$", "\\$")}`, "i");
    code = code.replace(reg, func);
    code = code.replaceAll("`", TranspilerCustoms.SL);

    const functionPosition = code.indexOf(func);
    code = code.substring(functionPosition, code.length);

    let leftCount = 0,
        rightCount = 0,
        i = 0;
    let rawTotal = "";
    // eslint-disable-next-line no-constant-condition
    while (true) {
        if (i >= code.length) break;
        if (!FuncD?.brackets ) {
            break;
        }
        if (!FuncD?.optional && !code.slice(func.length).startsWith("[")) {
            throw new TranspilerError("Function requires brackets", {
                function: {
                    name: func,
                    code: func,
                },
                cmd: command?.name,
                path: command?.__path__,
            });
        }

        if (rightCount === leftCount && rightCount !== 0) break;
        // if (!areBracketsBalanced(code)) {
        //     throw new TranspilerError(
        //         "Brackets are not balanced in code:\n\n" + code,
        //     );
        // }
        if (code.slice(func.length)[0] !== "[") {
            break;
        }
        if (code[i] === "[") leftCount++;
        else if (code[i] === "]") rightCount++;
        rawTotal += code[i];
        i++;
    }
    if (rawTotal === "") rawTotal = func;
    if (!areBracketsBalanced(rawTotal) && func !== "$EXECUTEMAINCODEFUNCTION")
        throw new TranspilerError("Brackets are not balanced", {
            function: {
                name: func,
                code: rawTotal,
            },
            cmd: command?.name,
            path: command?.__path__,
        });
    const funcs = [];
    let inside =
        rawTotal.endsWith("]") && rawTotal.startsWith(`${func}[`)
            ? rawTotal.substring(func.length + 1, rawTotal.length - 1)
            : undefined;

    const list = getFunctionList(inside || "", functions);

    functions.splice(0, list.length);

    let newinside = inside || "";
    while (list.length) {
        const func = list.shift() || "";
        const funcData = getFunctionData(newinside, func, list);

        inside = inside?.replace(
            funcData.inside?.replaceAll(TranspilerCustoms.FSEP, ";") ?? "",
            funcData.parsed,
        );
        newinside = newinside.replace(funcData.total, TranspilerCustoms.F);

        funcs.push(funcData);
    }
    const splits = inside?.split(";") || [];
    const parsed = inside?.replaceAll(";", TranspilerCustoms.FSEP);

    return {
        inside,
        total: rawTotal,
        splits,
        funcs,
        parsed: parsed ?? "",
        ...FuncD,
    };
}
export const functionFinderRegex = /(\$[a-z]+)/gi;

/**
 * Gets the list of functions in the given code.
 * @param {string} code - The code to get the functions in.
 * @param {string[]} functions - The list of valid functions.
 * @returns {string[]} - Returns the list of functions.
 * @example
 * ```js
 * getFunctionList("$ping") // ["$ping"]
 * ```
 */

export function getFunctionList(code: string, functions: string[]) {
    const raws = code.match(functionFinderRegex);
    if (!raws) return [];
    const functionsThatExists = functions.filter((x) =>
        code.toLowerCase().includes(x.toLowerCase()),
    );

    const res = [];

    for (const raw of raws) {
        const func = functionsThatExists.filter(
            (x) => x.toLowerCase() === raw.toLowerCase().slice(0, x.length),
        );
        if (func.length === 1) res.push(func[0]);
        else if (func.length > 1) {
            res.push(func.sort((a, b) => b.length - a.length)[0]);
        } else {
            continue;
        }
    }
    return res;
}

/**
 * Deep Reverses the given array of function data.
 * @param {funcData[]} arr - The array of function data to reverse.
 * @returns {funcData[]} - Returns the reversed array of function data.
 */

export function reverseArray(arr: funcData[]) {
    const res: funcData[] = [];
    for (let i = arr.length - 1; i >= 0; i--) {
        const el = arr[i];
        if (el.funcs.length) el.funcs = reverseArray(arr[i].funcs);
        res.push(el);
    }
    return res;
}

/**
 * Reverses the given code and function data.
 * @param {string} code - The code to reverse.
 * @param {funcData[]} funcs - The function data to reverse.
 * @returns {
 * {
 *   code: string;
 *  funcs: funcData[];
 * }
 * } - Returns an object containing the reversed code and function data.
 * @example
 * ```js
 * Reverse("$ping", [{ inside: "", total: "$ping", splits: [], funcs: [], parsed: "$ping", type: "getter", code: [Function (anonymous)] }]) // { code: "$ping", funcs: [{ inside: "", total: "$ping", splits: [], funcs: [], parsed: "$ping", type: "getter", code: [Function (anonymous)] }] }
 * ```
 */

export function Reverse(
    code: string,
    funcs: funcData[],
): {
    code: string;
    funcs: funcData[];
} {
    let codeWithGenricFuncs = code;

    for (const func of funcs) {
        codeWithGenricFuncs = codeWithGenricFuncs.replace(
            func.total,
            "#GENERIC-FUNCTION#",
        );
    }

    const reversedFuncs = reverseArray(funcs);

    for (const func of reversedFuncs) {
        codeWithGenricFuncs = codeWithGenricFuncs.replace(
            "#GENERIC-FUNCTION#",
            func.total,
        );
    }

    return { code: codeWithGenricFuncs, funcs: reversedFuncs };
}

/**
 * Executes the given code and function data to generate a js function.
 * @param {string} code - The code to execute.
 * @param {funcData[]} data - The function data to execute.
 * @param {Scope[]} scope - The scope to execute the code in.
 * @param {boolean} [reverse=false] - Whether to reverse the code and function data or not.
 * @returns {
 * {
 *   code: string;
 *  scope: Scope[];
 * }
 * } - Returns an object containing the generated js function and the scope.
 * @example
 * ```js
 * ExecuteData("$ping", [{ inside: "", total: "$ping", splits: [], funcs: [], parsed: "$ping", type: "getter", code: [Function (anonymous)] }], []) // { code: "__$DISCORD_DATA$__.client.ws.data.ping", scope: [] }
 * ```
 */

export function ExecuteData(
    code: string,
    data: funcData[],
    scope: Scope[],
    reverse = false,
) {
    let i = 0;

    if (reverse) {
        const { code: newCode, funcs } = Reverse(code, data);
        code = newCode;
        data = funcs;
        scope[0].rest = code;
    }
    while (i < data.length) {
        let d = data[i];

        const oldd = data[i].total;
        if (d.type === "scope" || d.type === "scope_getter") {
            const result = d.code(d, scope);
            scope = result.scope;
            d = <funcData>result.data;

            code = code.replace(d.total, result.code.replaceAll("$", "$$$$"));
            // .replace(d.total.replaceAll(";", "#FUNCTION_SEPARATOR#"), result.code);
            if (d.type === "scope_getter") {
                d.total = removeFF(d.total);
                scope[scope.length - 1].sendData.content = scope[
                    scope.length - 1
                ].sendData.content.replace(
                    d.total,
                    result.code.replaceAll("$", "$$$$"),
                );
            }
        } else {
            let executed: {
                code: string;
                scope: Scope[];
            };

            if (d.funcs.length) {
                executed = ExecuteData(
                    parseResult(d.inside ?? ""),
                    d.funcs,
                    scope,
                );

                scope = executed.scope;

                const oldtotal = d.total;

                d.total = d.total
                    .replace(
                        d.inside ?? "",
                        executed.code.replaceAll("$", "$$$$"),
                    )
                    .replace(
                        d.inside?.replaceAll(TranspilerCustoms.FSEP, ";") ?? "",
                        executed.code.replaceAll("$", "$$$$"),
                    );

                code = code
                    .replace(oldtotal, d.total.replaceAll("$", "$$$$"))
                    .replace(oldd, d.total.replaceAll("$", "$$$$"));

                d.inside = executed.code;
                d.splits = d.inside.split(";");

                const result = d.code(d, scope);

                code = code
                    .replace(d.total, result.code.replaceAll("$", "$$$$"))
                    // .replace(d.total.replaceAll(";", "#FUNCTION_SEPARATOR#"), result.code)
                    .replace(oldd, result.code.replaceAll("$", "$$$$"));

                if (d.type === "getter" || d.type === "function_getter") {
                    let oldcontent = scope[scope.length - 1].sendData.content;
                    scope[scope.length - 1].sendData.content = scope[
                        scope.length - 1
                    ].sendData.content.replace(
                        d.total,
                        result.code.replaceAll("$", "$$$$"),
                    );
                    if (
                        oldcontent === scope[scope.length - 1].sendData.content
                    ) {
                        scope[scope.length - 1].sendData.content = scope[
                            scope.length - 1
                        ].sendData.content.replace(
                            d.total.replaceAll(";", TranspilerCustoms.FSEP),
                            result.code.replaceAll("$", "$$$$"),
                        );
                        oldcontent = scope[scope.length - 1].sendData.content;
                    }
                    if (oldcontent === scope[scope.length - 1].sendData.content)
                        scope[scope.length - 1].sendData.content = scope[
                            scope.length - 1
                        ].sendData.content.replace(
                            oldd,
                            result.code.replaceAll("$", "$$$$"),
                        );
                }
            } else {
                executed = d.code(d, scope);
                scope = executed.scope;

                code = code.replace(
                    d.total,
                    executed.code.replaceAll("$", "$$$$"),
                );

                if (d.type === "getter" || d.type === "function_getter") {
                    const oldt = d.total;
                    const oldcontent = scope[scope.length - 1].sendData.content;
                    d.total = removeFF(d.total);
                    scope[scope.length - 1].sendData.content = scope[
                        scope.length - 1
                    ].sendData.content.replace(
                        d.total,
                        executed.code.replaceAll("$", "$$$$"),
                    );
                    if (oldcontent === scope[scope.length - 1].sendData.content)
                        scope[scope.length - 1].sendData.content = scope[
                            scope.length - 1
                        ].sendData.content.replace(
                            oldt,
                            executed.code.replaceAll("$", "$$$$"),
                        );
                }
            }
        }
        if (
            d.type !== "getter" &&
            d.type !== "function_getter" &&
            d.type !== "scope_getter"
        ) {
            const s = scope[scope.length - 1];
            const oldt = d.total;
            const oldcontent = s.sendData.content;
            d.total = removeFF(d.total);
            s.sendData.content = s.sendData.content.replace(d.total, "");
            if (oldcontent === s.sendData.content)
                s.sendData.content = s.sendData.content.replace(oldt, "");
            scope[scope.length - 1] = s;
        }
        i++;
    }
    return {
        code,
        scope,
    };
}

/**
 * uh idk what this does
 * @param {string} text - The text to parse.
 * @returns {string} - Returns the parsed text.
 */
export function _parseString(text: string) {
    const reg =
        /((#FUNCTION_START#([\s$a-z.0-9?(){}[\]._:'"`;=><,!-]|\n)+#FUNCTION_END#)|(__\$[a-z_?.()]+\$__))/gim;
    let matches = text.match(reg);
    const functionlist = matches?.slice(1) ?? [];
    functionlist;

    let temptext = text;

    if (matches) {
        matches = <RegExpMatchArray>matches.reverse();
        let i = 0;
        let u = 0;
        while (i < (matches?.length ?? 0)) {
            const match = <string>matches?.[i];
            const position = temptext.indexOf(match);
            const part = temptext.slice(position, position + match.length);
            const temppart = parseResult(part);

            temptext = `${temptext.slice(0, position)}${`__$${u
                .toString()
                .repeat(temppart.length - 3)}$__`}${temptext.slice(
                position + part.length,
                text.length,
            )}`;
            text = `${text.slice(0, position)}\${${temppart}}${text.slice(
                position + part.length,
                text.length,
            )}`;

            matches = <RegExpMatchArray>(temptext.match(reg)?.reverse() ?? []);
            i = 0;
            u++;
        }
        matches = <RegExpMatchArray>(
            (text.match(/__\$[0-9]+\$__/gi)?.reverse() ?? [])
        );

        matches?.forEach((x, y) => {
            text = text.replace(x, `\${${parseResult(functionlist[y])}}`);
        });

        text = `\`${text}\``;
    } else {
        text = `\`${text}\``;
    }
    return text;
}

/**
 * converts the given string to boolean
 * @param {string} output - The string to convert.
 * @returns {boolean} - Returns the converted boolean.
 * @example
 * ```js
 * convertToBool("true") // true
 * convertToBool("yes") // true
 * convertToBool("false") // false
 * convertToBool("no") // false
 * ```
 */
export function convertToBool(output: string) {
    return output === "true" || output === "yes" ? true : false;
}

/**
 * removes the FF transpiler customs
 * @param {string} total - The string to remove the customs from.
 * @returns {string} - Returns the string without the customs.
 */
export function removeFF(total: string) {
    if (!total.includes(TranspilerCustoms.FFS)) return total;
    const parts = total.split(TranspilerCustoms.FFS).slice(1);
    let i = 0;
    while (i < parts.length) {
        const part = parts[i].split(TranspilerCustoms.FFE)[0];
        total = total.replace(part, "");
        i++;
    }
    return parseResult(total);
}

export function removeF(total: string) {
    if (!total.includes(TranspilerCustoms.FS)) return total;
    const parts = total.split(TranspilerCustoms.FS).slice(1);
    let i = 0;
    while (i < parts.length) {
        const part = parts[i].split(TranspilerCustoms.FE)[0];
        total = total.replace(part, "");
        i++;
    }
    return total;
}

export function removeMF(total: string) {
    if (!total.includes(TranspilerCustoms.MFS)) return total;
    const parts = total.split(TranspilerCustoms.MFS).slice(1);
    let i = 0;
    while (i < parts.length) {
        const part = parts[i].split(TranspilerCustoms.MFE)[0];
        total = total.replace(part, "");
        i++;
    }
    return total;
}

/**
 * Checks if the given string is a bigint.
 * @param {string} string - The string to check.
 * @returns {boolean} - Returns true if the string is a bigint, false otherwise.
 * @example
 * ```js
 * isBigInt("1n") // true
 * isBigInt("1") // false
 * ```
 */

export function isBigInt(string: string) {
    return string.match(/^-?\d+n$/) !== null;
}

/**
 * Removes the multi line comments from the given code.
 * @param {string} code - The code to remove the comments from.
 * @returns {string} - Returns the code without the comments.
 * @example
 * ```js
 * removeMultiLineComments("/* comment *\/") // ""
 * ```
 */
export function removeMultiLineComments(code: string) {
    return code.replace(/\/\*[\s\S]*?\*\//g, "");
}
