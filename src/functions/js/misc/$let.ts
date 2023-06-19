import { TranspilerError } from "../../../core/error.js";
import { parseString } from "../../../core/parsers/stringParser.js";
import Scope from "../../../core/structs/Scope.js";
import { TranspilerCustoms } from "../../../typings/enums.js";
import { FunctionData, funcData } from "../../../typings/interfaces.js";
import {
    escapeVars,
    parseData,
    parseResult,
    removeSetFunc,
} from "../../../util/transpilerHelpers.js";

export const $let: FunctionData = {
    name: "$let",
    brackets: true,
    optional: false,
    type: "setter",
    fields: [
        {
            name: "name",
            type: "string",
            description: "The name of the variable to set",
            required: true,
        },
        {
            name: "value",
            type: "string",
            description: "The value to set the variable to",
            required: true,
        },
    ],
    version: "7.0.0",
    default: ["void", "void"],
    returns: "void",
    description: "Sets the value of the variable",
    example: `
        $let[hello;world] // sets the variable hello to world
    `,
    code: (data: funcData, scope: Scope[]) => {
        let res;
        const splits = data.splits;
        const currentScope = scope[ scope.length - 1 ];
        // Initial Error Handling
        if ($let.brackets) {
            if (
                !data.total.startsWith($let.name + "[") &&
                (!currentScope.name.startsWith("$try_") ||
                    !currentScope.name.startsWith("$catch_"))
            ) {
                throw new TranspilerError(
                    `${data.name} requires closure brackets`,
                );
            }
        }
        if (
            splits.length < 2 &&
            !currentScope.name.startsWith("$try_") &&
            !currentScope.name.startsWith("$catch_")
        ) {
            throw new TranspilerError(`${data.name} requires 2 arguments`);
        }
        const name = removeSetFunc(splits[0]);
        let value = parseData(removeSetFunc(splits.slice(1).join(";")));
        if (
            typeof value === "string" &&
            value.includes(TranspilerCustoms.FS) &&
            !value.includes(TranspilerCustoms.MFS) &&
            !(!value.split(TranspilerCustoms.FS)[0] && !value.split(TranspilerCustoms.FE)[1])
        ) {
            value = parseString(value);
        }
        // Error handling for name and value
        if (
            name === "" &&
            !currentScope.name.startsWith("$try_") &&
            !currentScope.name.startsWith("$catch_")
        ) {
            throw new TranspilerError(`${data.name} requires a name`);
        }
        if (
            name === value &&
            !currentScope.name.startsWith("$try_") &&
            !currentScope.name.startsWith("$catch_")
        ) {
            throw new TranspilerError(
                `${data.name} cannot be used to set itself`,
            );
        }

        if (currentScope.variables.includes(name)) {
            if (
                currentScope.variables.includes(parseResult(value)) ||
                value.toString().startsWith(TranspilerCustoms.FS) ||
                (value.toString().startsWith("`") &&
                    value.toString().endsWith("`")) ||
                value.toString().includes(TranspilerCustoms.MFS)
            ) {
                res = `${escapeVars(name)} = ${value};`;
            } else {
                res = `${escapeVars(name)} = \`${value}\`;`;
            }
        } else {
            if (
                typeof value !== "string" ||
                currentScope.variables.includes(
                    parseResult(value.toString()),
                ) ||
                value.toString().startsWith(TranspilerCustoms.FS) ||
                (value.toString().startsWith("`") &&
                    value.toString().endsWith("`")) ||
                value.includes(TranspilerCustoms.MFS)
            ) {
                res = `let ${escapeVars(name)} = ${value};`;
            } else {
                res = `let ${escapeVars(name)} = \`${value}\`;`;
            }
        }
        currentScope.variables.push(name);
        currentScope.update(res, data);
        scope[scope.length - 1] = currentScope;

        return { code: "", scope: scope };
    },
};
