import {
    FunctionData,
    TranspilerError,
    Transpiler,
    conditionLexer,
    parseStringObject,
} from "../../..";
import StringObject from "../../../core/structs/StringObject.js";
import Scope from "../../../core/structs/Scope.js";
import {
    getFunctionList,
    escapeResult,
} from "../../../util/transpilerHelpers.js";
import funcs from "../../index.js";
export const $loop: FunctionData = {
    name: "$loop",
    type: "scope",
    brackets: true,
    optional: false,
    fields: [
        {
            name: "times",
            type: "number",
            required: true,
        },
        {
            name: "extraData",
            type: "json",
            required: true,
        },
        {
            name: "code",
            type: "string",
            required: true,
        },
    ],
    version: "7.0.0",
    default: ["void", "void", "void"],
    returns: "void",
    description: "Loop statement",
    code: (data, scope) => {
        const splits = data.splits;
        const currentScope = scope[scope.length - 1];
        if (
            data.inside?.trim() === "" ||
            (!data.inside &&
                (!currentScope.name.startsWith("$try_") ||
                    !currentScope.name.startsWith("$catch_")))
        ) {
            throw new TranspilerError(
                `${data.name} function requires condition and code`,
            );
        }
        if (
            data.splits.length < 2 &&
            !currentScope.name.startsWith("$try_") &&
            !currentScope.name.startsWith("$catch_")
        ) {
            throw new TranspilerError(
                `${data.name} function requires condition and code`,
            );
        }
        let [times, extraData, ...code] = splits;

        if (
            isNaN(Number(times)) &&
            !currentScope.name.startsWith("$try_") &&
            !currentScope.name.startsWith("$catch_")
        ) {
            throw new TranspilerError(
                `${data.name} function requires times field as number`,
            );
        }
        const currentObj = new StringObject("{");
        currentObj.addEnd("}");
        let object;
        try {
            object = parseStringObject(extraData, currentObj);
        } catch (e) {
            throw new TranspilerError(`${data.name}: Invalid Object Provided`);
        }
        currentScope.env.push(...object.keys.map((x) => `loop_${x}`));
        currentScope.env.push("loop_index");
        let executedCode;
        const codeFunctionList = getFunctionList(
            code.join(";"),
            Object.keys(funcs),
        );
        if (
            code.join(";").startsWith("{execute:") &&
            code.join(";").endsWith("}")
        ) {
            object.keys = object.keys.map((x) => `loop_${x}`);

            const [name, type] = code
                .join(";")
                .split("{execute:")[1]
                .split("}")[0]
                .split(":");
            executedCode = `__$DISCORD_DATA$__.bot.cmds.get("${name}", "${type}").code({...__$DISCORD_DATA$__, ...${object.solve()} })`;
        } else if (codeFunctionList.length) {
            executedCode = Transpiler(code.join(";"), {
                sendMessage: false,
                scopeData: {
                    variables: currentScope.variables,
                    embeds: currentScope.embeds,
                    name: currentScope.name,
                    objects: currentScope.objects,
                    env: currentScope.env,
                },
            });
        } else {
            executedCode = code.join(";");
        }
        const res = escapeResult(`
for(let loop_index = 0; loop_index < ${times}; loop_index++) {
      ${
          typeof executedCode === "string"
              ? executedCode
              : (<{ code: string; scope: Scope[]; func: any }>(
                    executedCode
                ))?.scope[0].toString(false)
      }
}
`);
        currentScope.update(res, data);
        return { code: res, scope: scope, data };
    },
};
