import { TranspilerError } from "../../../core/error.js";
import { TranspilerCustoms } from "../../../typings/enums.js";
import { FunctionData } from "../../../typings/interfaces.js";
import {
    escapeMathResult,
    parseResult,
    removeF,
    removeFF,
    removeMF,
} from "../../../util/transpilerHelpers.js";

// function to check if a exression is valid js math expression
function isMathExpression(expression: string): boolean {
    expression = parseResult( removeFF( removeMF( removeF( expression.trim() ) ) ) );
    const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
    const mathOperators = ["+", "-", "*", "/", "%", "**", "(", ")","^","|", "&", ">>", "<<",];
    const MathClassFunctions = [
        "abs",
        "acos",
        "acosh",
        "asin",
        "asinh",
        "atan",
        "atan2",
        "atanh",
        "cbrt",
        "ceil",
        "clz32",
        "cos",
        "cosh",
        "exp",
        "expm1",
        "floor",
        "fround",
        "hypot",
        "imul",
        "log",
        "log10",
        "log1p",
        "log2",
        "max",
        "min",
        "pow",
        "random",
        "round",
        "sign",
        "sin",
        "sinh",
        "sqrt",
        "tan",
        "tanh",
        "trunc",
    ];
    const MathClassProperties = [
        "EULERNUM",
        "LN10",
        "LN2",
        "LOG10E",
        "LOG2E",
        "PI",
        "SQRT1_2",
        "SQRT2",
    ];
    const ops = [
        ...numbers,
        ...mathOperators,
        ...MathClassFunctions,
        ...MathClassProperties,
    ];

    for (const op of ops) {
        expression = expression.replaceAll(op, "");
    }
    return expression.trim() === "";
}
export const $math: FunctionData = {
    name: "$math",
    type: "getter",
    brackets: true,
    optional: false,
    fields: [
        {
            name: "expression",
            type: "number",
            required: true,
        },
    ],
    version: "7.0.0",
    default: ["void"],
    returns: "number",
    description: "evaluates a math expression",
    code: (data, scope) => {
        const numbers = data.inside;
        const currentScope = scope[scope.length - 1];
        if (
            data.splits.length === 0 &&
            !currentScope.name.startsWith("$try_") &&
            !currentScope.name.startsWith("$catch_")
        ) {
            throw new TranspilerError(
                `${data.name} requires at least 1 argument`,
            );
        }
        if (numbers && !isMathExpression(numbers)) {
            throw new TranspilerError(
                `${data.name} requires a valid math expression`,
            );
        }
        const regex = /(abs|acos|acosh|asin|asinh|atan|atan2|atanh|cbrt|ceil|clz32|cos|cosh|exp|expm1|floor|fround|hypot|imul|log|log10|log1p|log2|max|min|pow|random|round|sign|sin|sinh|sqrt|tan|tanh|trunc|LN10|LN2|LOG10E|LOG2E|PI|SQRT1_2|SQRT2)/g;
        let math = numbers?.replaceAll(regex, "Math.$1").replaceAll("EULERNUM", "Math.E");
        if ( !math )
        {
            throw new TranspilerError(
                `${data.name} requires a valid math expression`,
            );
        }
        const res = escapeMathResult(`(${parseResult(math)})`);
        currentScope.update(res, data);
        return {
            code: res,
            scope,
        };
    },
};
