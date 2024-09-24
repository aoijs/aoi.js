/**
 * @param {import("..").Data} d
 */
module.exports = async (d) => {
    const data = d.util.aoiFunc(d);
    const [numbers] = data.inside.splits;

    if (!numbers) return d.aoiError.fnError(d, "custom", {}, "Invalid math expression");

    const regex =
        /(abs|acos|acosh|asin|asinh|atan|atan2|atanh|cbrt|ceil|clz32|cos|cosh|exp|expm1|floor|fround|hypot|imul|log|log10|log1p|log2|max|min|pow|random|round|sign|sin|sinh|sqrt|tan|tanh|trunc|LN10|LN2|LOG10E|LOG2E|PI|SQRT1_2|SQRT2)/g;
    const math = numbers.addBrackets().replaceAll(regex, "Math.$1").replaceAll("EULERNUM", "Math.E");

    if (!math) {
        return d.aoiError.fnError(d, "custom", { inside: data.inside }, "Invalid math expression");
    }

    data.result = eval(math);

    return {
        code: d.util.setCode(data)
    };
};
