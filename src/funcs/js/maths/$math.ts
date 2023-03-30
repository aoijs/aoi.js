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
    const mathOperators = ["+", "-", "*", "/", "%", "**", "(", ")"];
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
        let math = numbers
            ?.replaceAll("sin", "Math.sin")
            .replaceAll("cos", "Math.cos")
            .replaceAll("tan", "Math.tan")
            .replaceAll("asin", "Math.asin")
            .replaceAll("acos", "Math.acos")
            .replaceAll("atan", "Math.atan")
            .replaceAll("atan2", "Math.atan2")
            .replaceAll("sinh", "Math.sinh")
            .replaceAll("cosh", "Math.cosh")
            .replaceAll("tanh", "Math.tanh")
            .replaceAll("asinh", "Math.asinh")
            .replaceAll("acosh", "Math.acosh")
            .replaceAll("atanh", "Math.atanh")
            .replaceAll("exp", "Math.exp")
            .replaceAll("log", "Math.log")
            .replaceAll("log10", "Math.log10")
            .replaceAll("log2", "Math.log2")
            .replaceAll("log1p", "Math.log1p")
            .replaceAll("expm1", "Math.expm1")
            .replaceAll("cbrt", "Math.cbrt")
            .replaceAll("hypot", "Math.hypot")
            .replaceAll("pow", "Math.pow")
            .replaceAll("sqrt", "Math.sqrt")
            .replaceAll("ceil", "Math.ceil")
            .replaceAll("floor", "Math.floor")
            .replaceAll("round", "Math.round")
            .replaceAll("sign", "Math.sign")
            .replaceAll("trunc", "Math.trunc")
            .replaceAll("fround", "Math.fround")
            .replaceAll("abs", "Math.abs")
            .replaceAll("max", "Math.max")
            .replaceAll("min", "Math.min")
            .replaceAll("random", "Math.random")
            .replaceAll("EULERNUM", "Math.E")
            .replaceAll("LN10", "Math.LN10")
            .replaceAll("LN2", "Math.LN2")
            .replaceAll("LOG10E", "Math.LOG10E")
            .replaceAll("LOG2E", "Math.LOG2E")
            .replaceAll("PI", "Math.PI")
            .replaceAll("SQRT1_2", "Math.SQRT1_2")
            .replaceAll("SQRT2", "Math.SQRT2")
            .replaceAll("clz32", "Math.clz32")
            .replaceAll("imul", "Math.imul");

        const res = escapeMathResult(`(${math})`);
        currentScope.update(res, data);
        return {
            code: res,
            scope,
        };
    },
};
