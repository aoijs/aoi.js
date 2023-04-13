import functions from "../functions/index.js";
import { getFunctionList, parseResult, getFunctionData, ExecuteData, } from "../util/transpilerHelpers.js";
import { TranspilerError } from "./error.js";
import { minify } from "../uglify.js";
import fixMath from "./parsers/mathParser.js";
import Scope from "./structs/Scope.js";
const functionNames = Object.keys(functions);
export function Transpiler(code, options) {
    const { scopeData, sendMessage, minify: uglify } = options;
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
    const res = ExecuteData(parseResult(code), FData.funcs, [globalScope], options.reverse ?? false);
    if (res.scope[0].sendData.content.trim() !== "") {
        const scope = res.scope[0];
        scope.hasSendData = true;
        scope.rest = scope.rest.replace(scope.sendData.content.trim(), "");
        res.scope[0] = scope;
    }
    let str = res.scope[0].getFunction(sendMessage);
    str = fixMath(str);
    const functionString = uglify ? minify(str) : str;
    if (uglify && functionString.error) {
        throw new TranspilerError(`code:${str} 
<------------------------------------------------------->
      Failed To Transpile Code with error ${functionString.error}`);
    }
    let func;
    if (options.parsedStringOnly)
        return {
            code: uglify
                ? functionString.code
                : functionString,
            func: async () => { return void 0; },
            scope: res.scope,
        };
    try {
        func = new Function("return " +
            (uglify
                ? functionString.code
                : functionString))();
    }
    catch (e) {
        throw new TranspilerError(e + "\n\n\n" + str);
    }
    return { func, ...res };
}
//# sourceMappingURL=transpiler.js.map