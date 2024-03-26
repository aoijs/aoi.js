function isMathExpression(expression) {
    expression = expression.trim();
    const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
    const mathOperators = ["+", "-", "*", "/", "%", "**", "(", ")", "^", "|", "&", ">>", "<<"];
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
        "trunc"
    ];
    const MathClassProperties = ["EULERNUM", "LN10", "LN2", "LOG10E", "LOG2E", "PI", "SQRT1_2", "SQRT2"];
    const ops = [...numbers, ...mathOperators, ...MathClassFunctions, ...MathClassProperties];

    for (const op of ops) {
        expression = expression.replaceAll(op, "");
    }
    return expression.trim() === "";
}

module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    const [numbers] = data.inside.splits;

    if (numbers && !isMathExpression(numbers)) {
        return d.aoiError.fnError(d, "custom", {}, "Invalid math expression");
    }

    const regex =
        /(abs|acos|acosh|asin|asinh|atan|atan2|atanh|cbrt|ceil|clz32|cos|cosh|exp|expm1|floor|fround|hypot|imul|log|log10|log1p|log2|max|min|pow|random|round|sign|sin|sinh|sqrt|tan|tanh|trunc|LN10|LN2|LOG10E|LOG2E|PI|SQRT1_2|SQRT2)/g;
    const math = numbers?.replaceAll(regex, "Math.$1").replaceAll("EULERNUM", "Math.E");

    if (!math) {
        return d.aoiError.fnError(d, "custom", {}, "Invalid math expression");
    }

    data.result = eval(math);

    return {
        code: d.util.setCode(data)
    };
};
