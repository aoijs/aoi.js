import funcs from "../functions/index.js";
import { TranspilerOptions } from "../typings/interfaces.js";
import { MinifyOutput, minify } from "uglify-js";
import {
    getFunctionList,
    parseResult,
    getFunctionData,
    ExecuteData,
} from "../util/transpilerHelpers.js";
import { TranspilerError } from "./error.js";

import fixMath from "./parsers/mathParser.js";
import Scope from "./structs/Scope.js";
import { AsyncFunction } from "../typings/types.js";

export function Transpiler(
    code: string,
    options: TranspilerOptions,
): { func: AsyncFunction; code: string; scope: Scope[] } {
    const { scopeData, sendMessage, minify: uglify,customFunctions } = options;
    const functions = { ...funcs, ...customFunctions };
    const functionNames = Object.keys(functions);
    const flist = getFunctionList(code, functionNames);

    flist.forEach((x) => {
        const reg = new RegExp(`${x.replace("$", "\\$")}`, "gi");
        code = parseResult(code);
        code = code.replace(reg, x);
    });

    const tempcode = `$EXECUTEMAINCODEFUNCTION[
        ${code}
    ]`;
    const FData = getFunctionData(tempcode, "$EXECUTEMAINCODEFUNCTION", flist);
    const globalScope = new Scope(scopeData?.name ?? "global", undefined, code);
    globalScope.addVariables(scopeData?.variables ?? []);
    globalScope.addEmbeds(scopeData?.embeds ?? []);
    globalScope.env.push(...(scopeData?.env ?? []));
    globalScope.objects = { ...globalScope.objects, ...scopeData?.objects };

    globalScope.sendFunction =
        scopeData?.sendFunction ?? globalScope.sendFunction;
    const res = ExecuteData(
        parseResult(code),
        FData.funcs,
        [globalScope],
        options.reverse ?? false,
    );

    if (res.scope[0].sendData.content.trim() !== "") {
        const scope = res.scope[0];
        scope.hasSendData = true;
        scope.rest = scope.rest.replace(scope.sendData.content.trim(), "");
        res.scope[0] = scope;
    }
    let str = res.scope[0].getFunction(sendMessage);
    str = fixMath(str);

    // eslint-disable-next-line @typescript-eslint/ban-types
    const functionString = uglify ? (minify)(str) : str;

    if (uglify && (<MinifyOutput>functionString).error) {
        throw new TranspilerError(
            `code:${str} 
<------------------------------------------------------->
      Failed To Transpile Code with error ${
    (<MinifyOutput>functionString).error
}`,
        );
    }
    let func;

    if (options.parsedStringOnly)
        return {
            code: uglify
                ? (<MinifyOutput>functionString).code
                : <string>functionString,
            func: async () => { return void 0; },
            scope: res.scope,
        };
    try {
        func = new Function(
            "return " +
                (uglify
                    ? (<MinifyOutput>functionString).code
                    : <string>functionString),
        )() as AsyncFunction;
    } catch (e) {
        throw new TranspilerError(e + "\n\n\n" + str);
    }

    return { func, ...res };
}
