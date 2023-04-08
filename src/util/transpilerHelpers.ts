import { TranspilerError } from "../core/error.js";
import Scope from "../core/structs/Scope.js";
import FUNCDATA from "../functions/index.js";
import { funcData } from "../typings/interfaces.js";
import { TranspilerCustoms } from "../typings/enums.js";
export function areBracketsBalanced(code: string) {
    const leftbracket = /\[/g;
    const rightbracket = /\]/g;
    const leftbracketCount = code.match(leftbracket)?.length ?? 0;
    const rightbracketCount = code.match(rightbracket)?.length ?? 0;
    return leftbracketCount === rightbracketCount;
}
export function countBrackets(code: string) {
    const leftbracket = /\[/g;
    const rightbracket = /\]/g;
    const leftbracketCount = code.match(leftbracket)?.length ?? 0;
    const rightbracketCount = code.match(rightbracket)?.length ?? 0;
    return { leftbracketCount, rightbracketCount };
}
export function parseData(text: string) {
    if (text === "") return text;
    else if (!isNaN(Number(text)) && Number.isSafeInteger(Number(text)))
        return Number(text);
    else if ((!isNaN(Number(text)) && !Number.isSafeInteger(text)) || isBigInt(text)) return BigInt(text.replace("n", ""));
    else if (text === "null") return null;
    else if (text === "undefined") return undefined;
    else if (text === "true" || text === "false") return text === "true";
    else {
        try {
            return JSON.parse(text);
        } catch {
            return text;
        }
    }
}
export function escapeVars(name: string) {
    return `__$${name}$__`;
}

export function escapeResult(res: string) {
    return `${TranspilerCustoms.FS}${res}${TranspilerCustoms.FE}`;
}
export function escapeMathResult(res: string) {
    return `${TranspilerCustoms.MFS}${res}${TranspilerCustoms.MFE}`;
}
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
        .replaceAll(TranspilerCustoms.MFE, "");
}
export function removeSetFunc(code: string) {
    return code
        .replaceAll(TranspilerCustoms.FSET, "")
        .replaceAll(TranspilerCustoms.FFUN, "");
}
export function escapeFunctionResult(result: string) {
    return `${TranspilerCustoms.FFS}${TranspilerCustoms.FS}${result}${TranspilerCustoms.FE}${TranspilerCustoms.FFE}`;
}
export function hasFunction(code: string) {
    return functionFinderRegex.test(code);
}

export function getFunctionData(
    code: string,
    func: string,
    functions: string[],
): funcData {
    const FuncD = FUNCDATA[func];
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
        if (!FuncD?.brackets && !code.slice(func.length).startsWith("[")) {
            break;
        }
        if (!FuncD?.optional && !code.slice(func.length).startsWith("[")) {
            throw new TranspilerError(`${func}: Required Brackets`);
        }
        if (
            areBracketsBalanced(code) &&
            countBrackets(code).leftbracketCount === 0
        )
            break;

        if (rightCount === leftCount && rightCount !== 0) break;
        if (!areBracketsBalanced(code)) {
            throw new TranspilerError(
                "Brackets are not balanced in code:\n\n" + code,
            );
        }
        if (code.slice(func.length)[0] !== "[") {
            break;
        }
        if (code[i] === "[") leftCount++;
        else if (code[i] === "]") rightCount++;
        rawTotal += code[i];
        i++;
    }
    if (rawTotal === "") rawTotal = func;
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
export const functionFinderRegex = /(\$[a-z]*)/gi;

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

export function reverseArray(arr: funcData[]) {
    const res : funcData[]= [];
    for ( let i = arr.length - 1; i >= 0; i-- )
    {
        const el = arr[ i ];
        if ( el.funcs.length ) el.funcs = reverseArray( ( arr[ i ].funcs ) );
        res.push(el);
    }
    return res;
}

export function ExecuteData(
    code: string,
    data: funcData[],
    scope: Scope[],
    reverse = false,
) {
    let i = 0;
    if ( reverse ) data = reverseArray( data );
    while (i < data.length) {
        let d = data[i];

        const oldd = data[i].total;
        if (d.type === "scope" || d.type === "scope_getter") {
            const result = d.code(d, scope);
            scope = result.scope;
            d = <funcData>result.data;

            code = code.replace(d.total, result.code);
            // .replace(d.total.replaceAll(";", "#FUNCTION_SEPARATOR#"), result.code);
            if (d.type === "scope_getter") {
                d.total = removeFF(d.total);
                scope[scope.length - 1].sendData.content = scope[
                    scope.length - 1
                ].sendData.content.replace(d.total, result.code);
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
                    .replace(d.inside ?? "", executed.code)
                    .replace(
                        d.inside?.replaceAll(TranspilerCustoms.FSEP, ";") ?? "",
                        executed.code,
                    );

                code = code.replace(oldtotal, d.total).replace(oldd, d.total);

                d.inside = executed.code;
                d.splits = d.inside.split(";");

                const result = d.code(d, scope);

                code = code
                    .replace(d.total, result.code)
                    // .replace(d.total.replaceAll(";", "#FUNCTION_SEPARATOR#"), result.code)
                    .replace(oldd, result.code);

                if (d.type === "getter" || d.type === "function_getter") {
                    scope[scope.length - 1].sendData.content = scope[
                        scope.length - 1
                    ].sendData.content
                        .replace(d.total, result.code)
                        .replace(
                            d.total.replaceAll(";", TranspilerCustoms.FSEP),
                            result.code,
                        )
                        .replace(oldd, result.code);
                }
            } else {
                executed = d.code(d, scope);
                scope = executed.scope;

                code = code.replace(d.total, executed.code);

                if (d.type === "getter" || d.type === "function_getter") {
                    d.total = removeFF(d.total);
                    scope[scope.length - 1].sendData.content = scope[
                        scope.length - 1
                    ].sendData.content.replace(d.total, executed.code);
                }
            }
        }
        if (
            d.type !== "getter" &&
            d.type !== "function_getter" &&
            d.type !== "scope_getter"
        ) {
            const s = scope[ scope.length - 1 ];
            const oldt = d.total;
            d.total = removeFF(d.total);
            s.sendData.content = s.sendData.content.replace(d.total, "").replace(oldt, "");
            scope[scope.length - 1] = s;
        }
        i++;
    }
    return {
        code,
        scope,
    };
}
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

export function convertToBool(output: string) {
    return output === "true" || output === "yes" ? true : false;
}

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

export function isBigInt ( string: string )
{
    return string.match ( /^-?\d+n$/ ) !== null;
}