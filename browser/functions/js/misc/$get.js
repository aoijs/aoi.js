import { TranspilerError } from "../../../core/error.js";
import { escapeResult, escapeVars, removeSetFunc, } from "../../../util/transpilerHelpers.js";
export const $get = {
    name: "$get",
    brackets: true,
    optional: false,
    type: "getter",
    fields: [
        {
            name: "name",
            type: "string",
            required: true,
        },
    ],
    version: "7.0.0",
    default: ["void"],
    returns: "any",
    description: "Gets the value of the variable",
    code: (data, scope) => {
        const splits = data.splits;
        const currentScope = scope[scope.length - 1];
        if ($get.brackets) {
            if (!data.total.startsWith($get.name + "[") &&
                (!currentScope.name.startsWith("$try_") ||
                    !currentScope.name.startsWith("$catch_"))) {
                throw new TranspilerError(`${data.name} requires closure brackets`);
            }
        }
        if (splits.length !== 1 &&
            !currentScope.name.startsWith("$try_") &&
            !currentScope.name.startsWith("$catch_")) {
            throw new TranspilerError(`${data.name} requires 1 argument`);
        }
        const name = removeSetFunc(splits[0]);
        if (name === "" &&
            !currentScope.name.startsWith("$try_") &&
            !currentScope.name.startsWith("$catch_")) {
            throw new TranspilerError(`${data.name} requires a name`);
        }
        if (!currentScope.variables.includes(name) &&
            !currentScope.name.startsWith("$try_") &&
            !currentScope.name.startsWith("$catch_")) {
            throw new TranspilerError(`${data.name} cannot find ${name}`);
        }
        const res = `${escapeResult(escapeVars(name))}`;
        currentScope.update(res, data);
        return { code: res, scope: scope };
    },
};
//# sourceMappingURL=$get.js.map